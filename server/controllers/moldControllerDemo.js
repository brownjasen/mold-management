// 内存中的 Mold 数据存储
let moldsData = [];
let moldIdCounter = 1;

exports.createMold = async (req, res) => {
  try {
    const { moldNumber, orderTime } = req.body;
    
    const mold = {
      _id: (moldIdCounter++).toString(),
      moldNumber,
      orderTime: new Date(orderTime),
      startTime: null,
      completionTime: null,
      overallProgress: 0,
      modules: {
        moldFrame: { name: '模架', stages: [], totalProgress: 0 },
        threeParts: { name: '三大件', stages: [], totalProgress: 0 },
        accessories: { name: '辅料', items: [], totalProgress: 0 },
        assembly: { name: '组装', stages: [], totalProgress: 0 },
        trialMold: { name: '试模', stages: [], totalProgress: 0 },
        repair: { name: '返修', items: [] }
      },
      priority: 0,
      queue: moldsData.length,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    moldsData.push(mold);
    res.json({ success: true, data: mold });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getMoldList = async (req, res) => {
  try {
    const sorted = moldsData.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.queue - b.queue;
    });
    res.json({ success: true, data: sorted });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getMoldDetail = async (req, res) => {
  try {
    const mold = moldsData.find(m => m._id === req.params.id);
    if (!mold) return res.status(404).json({ success: false, error: '模具未找到' });
    res.json({ success: true, data: mold });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateStageStatus = async (req, res) => {
  try {
    const { moldId, module, stageIndex, status } = req.body;
    const mold = moldsData.find(m => m._id === moldId);
    
    if (!mold) return res.status(404).json({ success: false, error: '模具未找到' });
    
    const stages = mold.modules[module].stages;
    if (!stages || !stages[stageIndex]) {
      return res.status(400).json({ success: false, error: '工序不存在' });
    }
    
    if (status === 'in_progress') {
      stages[stageIndex].startTime = new Date();
      stages[stageIndex].status = 'in_progress';
    } else if (status === 'completed') {
      stages[stageIndex].endTime = new Date();
      stages[stageIndex].status = 'completed';
      updateOverallProgress(mold);
    }
    
    mold.updatedAt = new Date();
    res.json({ success: true, data: mold });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.reprioritizeMold = async (req, res) => {
  try {
    const { moldId, newQueue } = req.body;
    const mold = moldsData.find(m => m._id === moldId);
    
    if (!mold) return res.status(404).json({ success: false, error: '模具未找到' });
    
    mold.priority = Date.now();
    mold.queue = newQueue;
    mold.updatedAt = new Date();
    
    const sorted = moldsData.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.queue - b.queue;
    });
    
    res.json({ success: true, data: sorted });
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
      if (module.stages && Array.isArray(module.stages)) {
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
    const mold = moldsData.find(m => m._id === moldId);
    
    if (!mold) return res.status(404).json({ success: false, error: '模具未找到' });
    
    mold.modules.repair.items.push({
      ...repairData,
      status: 'pending'
    });
    mold.status = 'repair';
    mold.updatedAt = new Date();
    
    res.json({ success: true, data: mold });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
