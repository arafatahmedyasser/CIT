/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition.utility;

import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;

/**
 * 
 * This class contains method to insert Uploaded File information in the DB.
 * 
 * @see com.intellectdesign.canvas.formdefinition.utility.FileDetailsDAO#fetchFileDetails(String, String, String)
 * @see com.intellectdesign.canvas.formdefinition.utility.FileDetailsDAO#deleteAttachFiles(String, String, String)
 * 
 * @version 1.0
 * */
public class FileUploadData
{
	/**
	 * This method logs the details of the uploaded file such as reference number, Gcif, UserNo, encryptedfilename, filename,
	 * filezise in database. 
	 *  
	 * @param: inputMap - Hashmap of cached client data
	 * 
	 * @throws DatabaseException
	 */
	public HashMap updateFileStatus(HashMap inputMap) throws DatabaseException, ProcessingErrorException
	{
		String methodName = "[FileUploadData]-";
		logger.ctinfo("CTFDF00086");
		DatabaseRequest dbReq = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;
		List returnedList = null;
		HashMap resultMap = new HashMap();

		logger.ctinfo("CTFDF00087", methodName, inputMap);
		try
		{
			dbReq.setDataAccessMapKey("ATTACH_FILE");
			dbReq.setOperation(DatabaseConstants.INSERT);
			dbReq.setOperationExtension("FILE_STATUS");
			dbReq.setData(inputMap);

			dbResult = dbReq.execute();
			returnedList = dbResult.getReturnedList();
			if (returnedList == null || returnedList.size() > 0)
			{
				throw new ProcessingErrorException("returnedList is empty");
			}
		} catch (DatabaseException exception)
		{
			logger.cterror("CTFDF00088", exception);
			throw new DatabaseException(exception.getMessage());
		} catch (Exception exception)
		{
			logger.cterror("CTFDF00089", exception);
			exception.printStackTrace();
			throw new ProcessingErrorException(exception.getMessage());
		}
		logger.ctinfo("CTFDF00090");
		return resultMap;
	}

	private static final Logger logger = Logger.getLogger(FileUploadData.class);
}