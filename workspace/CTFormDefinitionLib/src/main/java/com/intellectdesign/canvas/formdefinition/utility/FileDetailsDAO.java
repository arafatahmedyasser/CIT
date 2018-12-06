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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.formdefinition.FormDefinitionConstants;
import com.intellectdesign.canvas.logger.Logger;

/**
 * 
 * This method provides the implementation for the uploaded file details DAO. 
 * Once file is uploaded, the file details like Fiel Name, Size in Bytes, Reference ID, Maker ID 
 * and Date are logged in DB. This class provides access to the uploaded file details to retrive or to delete the uploaded files.
 * 
 * 
 * @version 1.0
 * */
public class FileDetailsDAO
{

	private static final Logger LOGGER = Logger.getLogger(FileDetailsDAO.class);

	/**
	 * default constructor
	 */

	public FileDetailsDAO()
	{

	}

	/**
	 * This method provides the hashmap of the file after fetching the DB for the reference number provided.
	 *  The hashmap contains the file details such as attachmentRefNo number, encryptedfilename, filename, 
	 *  file Size, uploaded Date, Maker Id and GCIF.
	 * 
	 * @param attachmentRefNo - Unique reference number of the uploaded file
	 * @param: UserNo - String value of the Maker who uploaded the file 
	 * @param: GCIF - String value of the GCIF of the maker
	 * @return FileDetails - HashMap of file details
	 * 
	 * @throws DatabaseException
	 */
	public HashMap fetchFileDetails(String attachmentRefNo, String userNo, String GCIF) throws Exception,
			DatabaseException
	{
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;
		HashMap resultMap = new HashMap();
		LOGGER.ctinfo("CTFDF00092");

		try
		{
			dbRequest.setDataAccessMapKey(FormDefinitionConstants.FETCH_FILE_DETAIL);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.addFilter("ATTACHMENT_REFERENCE_NO", attachmentRefNo);
			dbRequest.addFilter("OD_MAKER_ID", userNo);
			dbRequest.addFilter("OD_GCIF", GCIF);
			dbResult = dbRequest.execute();

			if (dbResult.getReturnedList() != null && !dbResult.getReturnedList().isEmpty())
				resultMap = (HashMap) dbResult.getReturnedList().get(0);
			LOGGER.ctdebug("CTFDF00093", attachmentRefNo);
			LOGGER.ctdebug("CTFDF00094", resultMap);
		} catch (DatabaseException dex)
		{
			LOGGER.cterror("CTFDF00095", dex, attachmentRefNo);
			throw dex;
		} catch (Exception ex)
		{
			LOGGER.cterror("CTFDF00095", ex, attachmentRefNo);
			throw ex;
		}
		LOGGER.ctinfo("CTFDF00096");
		return resultMap;
	}

	/**
	 * This method deletes the filedetails from Database using the attachmentRefNo number, userNo and GCIF. 
	 *  
	 * 
	 * @param attachmentRefNo -  Unique reference number of the uploaded file
	 * @param: UserNo - String value of the Maker who uploaded the file 
	 * @param: GCIF - String value of the GCIF of the maker
	 * @return deleteFileDetails - HashMap of string mapping which states the status of the file deletion. 
	 * 
	 * @throws DatabaseException
	 */
	public List<HashMap<String, String>> deleteAttachFiles(String attachmentRefNo, String userNo, String GCIF)
			throws Exception, DatabaseException
	{
		LOGGER.ctinfo("CTFDF00097", attachmentRefNo, userNo, GCIF);
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;
		List<HashMap<String, String>> returnedList = null;
		HashMap<String, String> resultMap = new HashMap<String, String>();
		int rowsDeleted = 0;

		try
		{
			returnedList = new ArrayList<HashMap<String, String>>();
			dbRequest.setDataAccessMapKey("FILE_DETAIL");
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension("FILE_STATUS");

			dbRequest.addFilter("ATTACHMENT_REFERENCE_NO", attachmentRefNo);
			dbRequest.addFilter("OD_MAKER_ID", userNo);
			dbRequest.addFilter("OD_GCIF", GCIF);

			dbResult = dbRequest.execute();
			rowsDeleted = dbResult.getNoOfRowsAffected();
			LOGGER.ctdebug("CTFDF00098", rowsDeleted);
			if (rowsDeleted > 0)
			{
				resultMap.put("STATUS", "FILEDELETED");
			} else
			{
				resultMap.put("STATUS", "FILENOTPRESENT");
			}
			resultMap.put("ROWSAFFECTED", Integer.toString(rowsDeleted));
			returnedList.add(resultMap);

		} catch (DatabaseException dex)
		{
			LOGGER.cterror("CTFDF00099", dex, attachmentRefNo);
			throw dex;
		} catch (Exception ex)
		{
			LOGGER.cterror("CTFDF00099", ex, attachmentRefNo);
			throw ex;
		}
		LOGGER.ctinfo("CTFDF00100", returnedList);
		return returnedList;
	}
}
