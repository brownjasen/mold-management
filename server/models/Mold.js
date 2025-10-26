const mongoose = require('mongoose');

const processStageSchema = new mongoose.Schema({
  name: String,
  percentage: Number,
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  startTime: Date,
  endTime: Date,
  subItems: [{
    name: String,
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    startTime: Date,
    endTime: Date
  }]
}, { _id: false });

const moduleSchema = new mongoose.Schema({
  name: String,
  stages: [processStageSchema],
  items: [new mongoose.Schema({
    name: String,
    quantity: Number,
    orderStatus: { type: String, enum: ['pending', 'ordered', 'completed'], default: 'pending' },
    completed: Boolean
  }, { _id: false })],
  totalProgress: Number
}, { _id: false });

const moldSchema = new mongoose.Schema({
  moldNumber: { type: String, unique: true, required: true },
  orderTime: Date,
  startTime: Date,
  completionTime: Date,
  overallProgress: { type: Number, default: 0 },
  
  modules: {
    moldFrame: {
      type: new mongoose.Schema({
        name: { type: String, default: '模架' },
        stages: [processStageSchema],
        totalProgress: Number
      }, { _id: false })
    },
    threeParts: {
      type: new mongoose.Schema({
        name: { type: String, default: '三大件' },
        stages: [processStageSchema],
        totalProgress: Number
      }, { _id: false })
    },
    accessories: {
      type: new mongoose.Schema({
        name: { type: String, default: '辅料' },
        items: [{
          name: String,
          quantity: Number,
          orderStatus: { type: String, enum: ['pending', 'ordered', 'completed'], default: 'pending' },
          completed: Boolean
        }],
        totalProgress: Number
      }, { _id: false })
    },
    assembly: {
      type: new mongoose.Schema({
        name: { type: String, default: '组装' },
        stages: [processStageSchema],
        totalProgress: Number
      }, { _id: false })
    },
    trialMold: {
      type: new mongoose.Schema({
        name: { type: String, default: '试模' },
        stages: [processStageSchema],
        totalProgress: Number
      }, { _id: false })
    },
    repair: {
      type: new mongoose.Schema({
        name: { type: String, default: '返修' },
        items: [{
          workpiece: String,
          reason: String,
          content: String,
          responsible: String,
          hours: Number,
          lossAmount: Number,
          status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
          startTime: Date,
          endTime: Date
        }]
      }, { _id: false })
    }
  },
  
  priority: { type: Number, default: 0 },
  queue: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'repair'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Mold', moldSchema);
