require(["notebook/js/outputarea", "base/js/dialog","notebook/js/codecell"], function(oa, dialog, cc){
    console.log(oa.OutputArea, oa.OutputArea.prototype)
    oa.OutputArea.prototype._handle_output = oa.OutputArea.prototype.handle_output
    console.log('[extension]: will drop ifmore than 10 messages/cell')
    oa.OutputArea.prototype.handle_output = function (msg){
        if(!this.count){this.count=0}
        this.count = this.count+String(msg.content.data).length;
        if(this.count>500){
            if(!this.drop){
            dialog.modal({
                    title : 'Infinite loop ? ',
                    body : "Oops, I got too many things from kernel ! I'll just drop them !",
                    buttons : {'OK' : { 'class' : 'btn-primary' },
                    }
                }
                )
            }
            this.drop=true;
            return 
        }
        return this._handle_output(msg);
    }

    cc.CodeCell.prototype._execute = cc.CodeCell.prototype.execute;
    cc.CodeCell.prototype.execute = function(){
        // reset counter on execution.
        this.output_area.count = 0;
        this.output_area.drop  = false;
        return this._execute();
    }

});
