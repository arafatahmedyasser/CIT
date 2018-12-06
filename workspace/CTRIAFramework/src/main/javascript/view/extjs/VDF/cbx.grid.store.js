/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
Ext.namespace('cbx.grid');
cbx.grid.Store = Ext.extend(Ext.data.Store, {
	bufferSize : 45,
	isLoading : false,
	remoteSort : true,
	singleSort : function (fieldName, dir){
		var field = this.fields.get(fieldName);
		if (!field) {
			return false;
		}

		var name = field.name, sortInfo = this.sortInfo || null, sortToggle = this.sortToggle ? this.sortToggle[name]
					: null;

		if (!dir) {
			if (sortInfo && sortInfo.field == name) { // toggle
				// sort
				// dir
				dir = (this.sortToggle[name] || 'ASC').toggle('ASC', 'DESC');
			} else {
				dir = field.sortDir;
			}
		}

		this.sortToggle[name] = dir;
		this.sortInfo = {
			field : name,
			direction : dir
		};
		this.hasMultiSort = false;

		if (this.remoteSort) {
			this.lastOptions = this.lastOptions || {};
			this.lastOptions.params = this.lastOptions.params || {};
			this.lastOptions.params.start = 0;
			this.lastOptions.add = false;
			if (!this.load(this.lastOptions)) {
				if (sortToggle) {
					this.sortToggle[name] = sortToggle;
				}
				if (sortInfo) {
					this.sortInfo = sortInfo;
				}
			}
		} else {
			this.applySort();
			this.fireEvent('datachanged', this);
		}
		return true;
	}
});
