const Mold = require('../models/Mold');

exports.createMold = async (req, res) => {
  try {
    const { moldNumber, orderTime } = req.body;
    const mold = new Mold({ 
      moldNumber, 
      orderTime: new Date(orderTime),
      modules: {
        moldFrame: { name: '模架', stages: [], totalProgress: 0 },
        threeParts: { name: '三大件', stages: [], totalProgress: 0 },
        accessories: { name: '辅料', items: [], totalProgress: 0 },
        assembly: { name: '组装', stages: [], totalProgress: 0 },
        trialMold: { name: '试模', stages: [], totalProgress: 0 },
        repair: { name: '返修', items: [] }
      }
    });
    await mold.save();
    res.json({ success: true, data: mold });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getMoldList = async (req, res) => {
  try {
    const molds = await Mold.find().sort({ priority: -1, queue: 1 });
    res.json({ success: true, data: molds });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getMoldDetail = async (req, res) => {
  try {
    const mold = await Mold.findById(req.params.id);
    if (!mold) return res.status(404).json({ success: false, error: 'Mold not found' });
    res.json({ success: true, data: mold });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateStageStatus = async (req, res) => {
  try {
    const { moldId, module, stageIndex, status } = req.body;
    const mold = await Mold.findById(moldId);
    
    if (!mold) return res.status(404).json({ success: false, error: 'Mold not found' });
    
    const stages = mold.modules[module].stages;
    if (status === 'in_progress') {
      stages[stageIndex].startTime = new Date();
      stages[stageIndex].status = 'in_progress';
    } else if (status === 'completed') {
      stages[stageIndex].endTime = new Date();
      stages[stageIndex].status = 'completed';
      updateOverallProgress(mold);
    }
    
    await mold.save();
    res.json({ success: true, data: mold });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.reprioritizeMold = async (req, res) => {
  try {
    const { moldId, newQueue } = req.body;
    await Mold.findByIdAndUpdate(moldId, { queue: newQueue, priority: Date.now() });
    const molds = await Mold.find().sort({ priority: -1, queue: 1 });
    res.json({ success: true, data: molds });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

function updateOverallProgress(mold) {
  let totalPercentage = 0;
  let completedPercentage = 0;
  
  Object.keys(mold.modules).forEach(key => {
    if (key !== 'repair') {
      const module = mold.modules[key];
      if (module.stages) {
        module.stages.forEach(stage => {
          totalPercentage += stage.percentage || 0;
          if (stage.status === 'completed') {
            completedPercentage += stage.percentage || 0;
          }
        });
      }
    }
  });
  
  mold.overallProgress = totalPercentage > 0 ? Math.round((completedPercentage / totalPercentage) * 100) : 0;
}

exports.addRepair = async (req, res) => {
  try {
    const { moldId, repairData } = req.body;
    const mold = await Mold.findById(moldId);
    mold.modules.repair.items.push(repairData);
    mold.status = 'repair';
    await mold.save();
    res.json({ success: true, data: mold });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
