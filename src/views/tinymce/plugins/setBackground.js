tinymce.PluginManager.add('useBackgroundColor', (editor) => {
    // 注册自定义事件
    // 步骤1：定义元素特征标识
    const CUSTOM_ELEMENT_CLASS = 'persistent-custom-element';
    const DATA_ATTR = 'data-custom-state';

    // 步骤2：修改插入命令（保存状态到HTML）
    editor.addCommand('insertCustomElement', () => {
      const el = editor.dom.create('div', { 
        class: CUSTOM_ELEMENT_CLASS,
        [DATA_ATTR]: 'default',
        style: 'background-color: #00000080; width: 100px; height: 100px;display: inline-block;'
      });
      
      editor.insertContent(editor.dom.getOuterHTML(el));
    });
    // 步骤3：初始化时事件委托（核心解决逻辑）
    editor.on('init', () => {
      // 3.1 绑定全局点击委托
      editor.on('click', (e) => {
        const target = e.target;
        const element = editor.dom.getParent(target, `.${CUSTOM_ELEMENT_CLASS}`);
        
        if (element) {
          const currentState = element.getAttribute(DATA_ATTR);
          const newState = currentState === 'active' ? 'inactive' : 'active';
          // 3.2 更新元素状态并触发变更
          editor.dom.setAttrib(element, DATA_ATTR, newState);
          editor.undoManager.add(); // 确保可撤销
        }
      });

      // 3.3 修复已有元素（处理序列化后的内容）
      editor.dom.select(`.${CUSTOM_ELEMENT_CLASS}`).forEach(element => {
        if (!element.hasAttribute(DATA_ATTR)) {
          editor.dom.setAttrib(element, DATA_ATTR, 'default');
        }
      });
    });
  
    // 注册颜色块按钮
    editor.ui.registry.addButton('colorBlock', {
      icon: 'block',
      tooltip: '插入颜色块',
      onAction: () => {
        // openColorBlockDialog(editor);
        editor.dispatch('insertCustomElement');
        editor.execCommand('insertCustomElement', false, {
          // rows: data.numRows,
          // columns: data.numColumns
        });
      }
    });
  
    // 注册上下文菜单
    editor.ui.registry.addContextMenu('colorBlockContext', {
      update: (element) => {
        return element.classList.contains('color-block') ? 
          ['editColorBlock'] : 
          [];
      }
    });
  
    // 注册颜色块编辑菜单
    editor.ui.registry.addMenuItem('editColorBlock', {
      text: '编辑颜色块',
      onAction: () => {
        openColorBlockDialog(editor, true);
      }
    });

    // 打开颜色块对话框
    const openColorBlockDialog = (editor, isEdit = false) => {
      const selectedNode = editor.selection.getNode();
      const initialData = isEdit && selectedNode.classList.contains('color-block') ? {
        color: selectedNode.style.backgroundColor || '#FF0000',
        width: selectedNode.style.width || '100px',
        height: selectedNode.style.height || '50px'
      } : {
        color: '#FF0000',
        width: '100px',
        height: '50px'
      };
  
      editor.windowManager.open({
        title: isEdit ? '编辑颜色块' : '插入颜色块',
        body: {
          type: 'panel',
          items: [
            {
              type: 'colorinput',
              name: 'color',
              label: '背景颜色',
              value: initialData.color
            },
            {
              type: 'input',
              name: 'width',
              label: '宽度',
              value: initialData.width
            },
            {
              type: 'input',
              name: 'height',
              label: '高度',
              value: initialData.height
            }
          ]
        },
        buttons: [
          { type: 'cancel', text: '取消' },
          { 
            type: 'submit', 
            text: '确定', 
            primary: true,
            onAction: (api) => {
              const data = api.getData();
              
              // 创建/更新颜色块
              const blockHtml = `<div class="color-block" 
                style="
                  background-color: ${data.color};
                  width: ${data.width};
                  height: ${data.height};
                  display: inline-block;
                  border: 1px solid #ccc;
                  cursor: pointer;
                "></div>`;
  
              if (isEdit) {
                editor.dom.replace(blockHtml, selectedNode);
              } else {
                editor.insertContent(blockHtml);
              }
              
              api.close();
            },
          }
        ],
        onSubmit: (api) => {
            const data = api.getData();
            
            // 创建/更新颜色块
            const blockHtml = `<div class="color-block" 
                style="
                    background-color: ${data.color};
                    width: ${data.width};
                    height: ${data.height};
                    display: inline-block;
                    border: 1px solid #ccc;
                    cursor: pointer;
                "></div>`;

            if (isEdit) {
                const selectedNode = editor.selection.getNode();
                if (selectedNode.classList.contains('color-block')) {
                    editor.dom.setStyles(selectedNode, {
                        'background-color': data.color,
                        'width': data.width,
                        'height': data.height
                    });
                }
            } else {
                editor.insertContent(blockHtml);
            }
            
            api.close();
        }
      });
    };
  });