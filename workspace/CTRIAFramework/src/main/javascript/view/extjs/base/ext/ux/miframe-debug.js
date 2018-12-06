/** 
 * iFrame panel 
 * 
 * @author    Steffen Kamper 
 */ 

Ext.ns('Ext.ux.ManagedIFrame'); 

Ext.ux.ManagedIFrame.Panel = Ext.extend(Ext.Panel, { 
    name: 'iframe', 
    iframe: null, 
    defaultSrc: Ext.isIE && Ext.isSecure ? Ext.SSL_SECURE_URL : 'about:blank', 
    maskMessage: 'loading ...', 
    doMask: true, 
     
        // component build 
    initComponent: function() { 
        this.bodyCfg = { 
            tag: 'iframe', 
            style:"width:100%;height:100%;",
            frameborder: '0', 
            src: this.defaultSrc, 
            name: this.name
        } 
        Ext.apply(this, { 
         
        }); 
        Ext.ux.ManagedIFrame.Panel.superclass.initComponent.apply(this, arguments); 
         
        // apply the addListener patch for 'message:tagging' 
        this.addListener = this.on; 
         
    }, 
     
    onRender : function() { 
        Ext.ux.ManagedIFrame.Panel.superclass.onRender.apply(this, arguments); 
        this.iframe = Ext.isIE ? this.body.dom.contentWindow : window.frames[this.name];
        this.body.dom[Ext.isIE ? 'onreadystatechange' : 'onload'] = this.loadHandler.createDelegate(this); 
    }, 
     
    loadHandler: function() { 
        this.src = this.body.dom.src; 
        this.removeMask(); 
    }, 
     
    getIframe: function() { 
        return this.iframe; 
    }, 
    getUrl: function() { 
        return this.body.dom.src; 
    }, 
     
    setUrl: function(source) { 
        this.setMask(); 
        this.body.dom.src = source; 
    }, 
     
    resetUrl: function() { 
        this.setMask(); 
        this.body.dom.src = this.src; 
    }, 
     
    refresh: function() { 
        if (!this.isVisible()) { 
            return; 
        } 
        this.setMask(); 
        this.body.dom.src = this.body.dom.src; 
    }, 

    /** @private */ 
    setMask: function() { 
        if (this.doMask) { 
            this.el.mask(this.maskMessage); 
        } 
    }, 
    removeMask: function() { 
        if (this.doMask) { 
            this.el.unmask(); 
        } 
    } 
}); 
Ext.reg('iframePanel', Ext.ux.ManagedIFrame.Panel);