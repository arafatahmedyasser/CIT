/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.sync;

import java.util.ArrayList;
import java.util.List;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;

/**
 * SyncMetadataInstruction class invoked from handler(SyncMetadata) layer to interact with Database Access Layer
 * 
 */
public class SyncMetadataInstruction
{
	/**
	 * Method retrives the metadata based on the Type(WIDGET/WIDGET_MD/FORM/MULTI_WIDGET/FORM_CONTAINER) ,Keys(List of
	 * types) and Synctime(String).
	 * 
	 * @param type
	 * @param SyncTime
	 * @param Keys
	 * @return List(metadata info)
	 */
	public List getMetaDataInfo(String type, ArrayList Keys, String syncTime) throws DatabaseException
	{
		DatabaseRequest dbReq = null;
		DatabaseResult dbResult = null;
		List usersList = new ArrayList();
		dbReq = new CanvasDatabaseRequest();
		dbReq.setDataAccessMapKey("SYNC_METADATA_FRMK");
		dbReq.setOperation(DatabaseConstants.SELECT);
		dbReq.setOperationExtension("SYNC_METADATA_DTLS");
		dbReq.addFilter("TYPE", type);
		dbReq.addFilter("TYPE_ID_LIST", Keys);
		dbReq.addFilter("UPD_DT", syncTime);
		dbResult = dbReq.execute();
		usersList = dbResult.getReturnedList();

		return usersList;
	}

	/**
	 * This method retrives the initial metadata information based on login user
	 * 
	 * @param User Number
	 * @return List(initial metadata info)
	 * @throws DatabaseException
	 */
	public List getInitialMetaDataInfo(String userNo) throws DatabaseException
	{
		DatabaseRequest dbReq = null;
		DatabaseResult dbResult = null;
		List iMetadataList = new ArrayList();
		dbReq = new CanvasDatabaseRequest();
		dbReq.setDataAccessMapKey("SYNC_METADATA_FRMK");
		dbReq.setOperation(DatabaseConstants.SELECT);
		dbReq.setOperationExtension("INITAIL_METADATA_DTLS");
		dbReq.addFilter("USER_NO", userNo);
		dbResult = dbReq.execute();
		iMetadataList = dbResult.getReturnedList();
		return iMetadataList;
	}
}
