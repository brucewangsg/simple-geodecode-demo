function createUndoRedo() {
  var undos = [];
  var redos = [];
  var currentStack = 0;
  var currentStackInsertArray = 0;
  var totalUndos = 0;
  var updateCallbacks = [];

  var maxSlot = 20000;
  var totalSlotAvailable = 1;
  
  return {
    undo : function () {
      if (!this.canUndo()) {
        return;
      }
      if (maxSlot > 0) {
        currentStack--;
        currentStackInsertArray = (currentStackInsertArray - 1 + totalSlotAvailable) % totalSlotAvailable;
        undos[currentStackInsertArray]();
      } else {
        currentStack--;
        undos[currentStack]();
      }
      this.triggerUpdate();
    },
  
    redo : function () {
      if (!this.canRedo()) {
        return;
      }
      if (maxSlot > 0) {
        redos[currentStackInsertArray]();
        currentStack++;
        currentStackInsertArray = (currentStackInsertArray + 1) % totalSlotAvailable;
      } else {        
        redos[currentStack]();
        currentStack++;
      }
      this.triggerUpdate();
    },
    
    canUndo : function () {
      return currentStack > 0;
    },
    
    canRedo : function () {
      return currentStack < totalUndos;
    },
  
    pushUndoRedo : function (uFunc, rFunc) {
      if (maxSlot > 0) {
        totalSlotAvailable = Math.min(maxSlot, totalSlotAvailable+1);
        totalUndos = Math.min(currentStack + 1, totalSlotAvailable);
      } else {
        totalUndos = currentStack + 1;
      }
      undos[ currentStackInsertArray ] = uFunc;
      redos[ currentStackInsertArray ] = rFunc;
      if (maxSlot > 0) {
        currentStack = Math.min(totalSlotAvailable, currentStack+1);
        currentStackInsertArray = (currentStackInsertArray + 1) % totalSlotAvailable;
      } else {
        currentStack++;
        currentStackInsertArray++;
      }
      this.triggerUpdate();
    },

    clearAll : function () {
      undos = [];
      redos = [];
      currentStack = 0;
      currentStackInsertArray = 0;
      totalSlotAvailable = 1;
      totalUndos = 0;
      this.triggerUpdate();
    },

    changed : function (f) {
      if (f) {
        updateCallbacks.push(f);
      }
    },

    triggerUpdate : function () {
      for (var i = 0, len = updateCallbacks.length; i < len; i++) {
        updateCallbacks[i]();
      }
    }
    
  }
};

