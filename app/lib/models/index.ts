import mongoose from 'mongoose'

import User from './user';
import Workspace from './workspace';
import Board from './board';
import Column from './column';
import Card from './card'

console.log('Registered models :', mongoose.models);

export { User, Workspace, Board, Column, Card };