import { NextRequest, NextResponse } from "next/server";
import { Card, WebhookEvent }  from '@/app/lib/models';
import connectToDatabase from "@/app/lib/mongodb";

export async function POST(request : NextRequest){
    const body = await request.json();

    if(!body){
        return NextResponse.json({error : 'No body provided'}, {status : 400});
    };

    await connectToDatabase();

    const requestTitle = body.pull_request.title;


    const regexp = /\[([^\]]+)\]/g;

    const match = [...requestTitle.matchAll(regexp)].flatMap(match => match[1])
        .flatMap(content => [...content.matchAll(/-(\d+)/g)]).map(match => match[1]);

    try{
        const webhook = await WebhookEvent.findOneAndUpdate(
            {githubRequestId : body.pull_request.id},
            {
                title : requestTitle,
                githubLink : body.pull_request.html_url,
                author : body.pull_request.user.login,
                state : body.pull_request.state,
            },
            {
                upsert : true,
                setDefaultsOnInsert : true,
                new : true,
            },
        );

        if(webhook){
            const errors : string[] = [];

            const linkedCards = await Card.find({webhookEvents : webhook._id});

            const linkedTicketNumbers = linkedCards.map((card)=> String(card.ticketNumber));

            const ticketsToLink = match.filter((ticket)=> !linkedTicketNumbers.includes(String(ticket)));

            const cardsToUnlink = linkedCards.filter((card)=> !match.includes(String(card.ticketNumber)));
            
            if(ticketsToLink.length){
                await Promise.all(
                    ticketsToLink.map(async (ticket)=>{
                        try{
                            await Card.findOneAndUpdate(
                                {ticketNumber : ticket},
                                {$addToSet : {webhookEvents : webhook._id}},
                            );
                        }
                        catch(error){
                            errors.push(`Error linking card with ticket ${ticket}`);
                        }
                    })
                );
            }

            
            if(ticketsToLink.length){
                await Promise.all(
                    ticketsToLink.map(async (ticket)=>{
                        try{
                            await Card.findOneAndUpdate(
                                {ticketNumber : ticket},
                                {$addToSet : {webhookEvents : webhook._id}},
                            );
                        }
                        catch(error){
                            errors.push(`Error linking card with ticket ${ticket}`);
                        }
                    })
                );
            };

            if(cardsToUnlink.length){
                await Promise.all(
                    cardsToUnlink.map(async (card)=>{
                        const updatedCardWebhookEvents = card.webhookEvents.filter((event)=> String(event) !== String(webhook._id));
                        try{
                            await Card.findByIdAndUpdate(
                                card._id,
                                {webhookEvents : updatedCardWebhookEvents},
                            )
                        }
                        catch(error){
                            errors.push(`Error unlinking card with ticket ${card.ticketNumber}`);
                        }
                    })
                )
            }

            if(errors.length > 0){
                console.log("Some errors occured while processing webhook", errors);
            }
        }



        return NextResponse.json(null, {status : 200});
    }
    catch(error){
        console.log("Error processing webhook", error);
        return NextResponse.json({error: 'Internal server error'}, { status : 500 })
    }
}
