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

package com.intellectdesign.canvas.alert.mail;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.properties.reader.CTProperties;

/**
 * This class prepares the reports to be sent to the list of subscribed users by mails. 
 *  
 * @version 1.0
 */
public class ReportMail
{

	private static Logger LOGGER = Logger.getLogger(ReportMail.class);

	/**
	 * The <code> run </code> method is the overridden method of the TimerTask Class.
	 * This method invokes the {@link getReportList} method according to the scheduler time.
	 * 
	 */

	public void run()
	{
		Log4jMDCInitializer initializer = new Log4jMDCInitializer();
		initializer.initLog4jMDC("ReportMail:run()", "SCHEDULER");
		getReportList();
	}

	/**
	 * This method gets the list of reports and the users subscription details 
	 * and passes to {@link TxnMailExt} to send mails
	 * 
	 */
	public void getReportList()
	{
		String cmName = "ReportMail.getReportList()";
		LOGGER.ctinfo("CTALT00354", cmName);
		List returnList = new ArrayList();
		DatabaseRequest databaseRequest = null;
		DatabaseResult dbResult = null;
		TxnMailExt mailext = new TxnMailExt();
		String lastCount = "";
		lastCount = getLastSeqNo();
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.MAIL_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.RETRIEVE_SUBSCRIBED_REPORT);
			databaseRequest.addFilter("lastCount", lastCount);
			dbResult = databaseRequest.execute();
			returnList = dbResult.getReturnedList();
			updateLastExeCount();
		} catch (DatabaseException dbEx)
		{
			LOGGER.cterror("CTALT00355", dbEx);
		}
		if (returnList.size() > 0)
		{
			for (int i = 0; i < returnList.size(); i++)
			{
				HashMap resMap = new HashMap();
				MailDataValue mailValObj = new MailDataValue();
				resMap = (HashMap) returnList.get(i);
				mailValObj.settoID((String) resMap.get("EMAIL_ID"));
				mailValObj.setsubject((String) resMap.get("OD_REPORT_NAME"));
				mailValObj.setbody(CTProperties.getProperty("MAIL_REPORT_BODY_NOTE")
						+ (String) resMap.get("OD_REPORT_NAME"));
				mailValObj.setfromId(CTProperties.getProperty("MAIL_FROM_DEFAULT"));
				mailValObj.setreplyTo("");
				mailValObj.setpath((String) resMap.get("REP_PATH") + (String) resMap.get("REP_NAME"));
				mailValObj.setCC("");
				mailValObj.setbulk("N");
				mailValObj.setBCC("");
				mailext.storeMail(mailValObj);
			}
		}
	}

	/**
	 * This method updates the last execution number in OD_REPORT_MAINTENANCE table.  
	 * 
	 */

	public void updateLastExeCount()
	{
		String cmName = "ReportMail.updateLastExeCount()";
		LOGGER.ctinfo("Entered into Method", cmName);
		DatabaseRequest databaseRequest = null;
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.MAIL_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.UPDATE);
			databaseRequest.setOperationExtension(AlertConstants.LAST_SEQUENCE);
			databaseRequest.execute();
		} catch (DatabaseException dbEx)
		{
			LOGGER.cterror("CTALT00356", dbEx);
		}
	}

	/**
	 * This method returns the last execution sequence number of a report
	 * 
	 * @return lastCount - String value of the last sequence number
	 * 
	 */

	public String getLastSeqNo()
	{
		String cmName = "ReportMail.getLastSeqNo()";
		LOGGER.ctinfo("CTALT00357", cmName);
		String lastCount = "";
		List returnList = new ArrayList();
		DatabaseRequest databaseRequest = null;
		DatabaseResult dbResult = null;
		HashMap countMap = new HashMap();
		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.MAIL_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(AlertConstants.RETRIEVE_LAST_SEQUENCE);
			dbResult = databaseRequest.execute();
			returnList = dbResult.getReturnedList();
			countMap = (HashMap) returnList.get(0);
			lastCount = (String) countMap.get("LAST_SEQUENCE_NO");
		} catch (DatabaseException dbEx)
		{
			LOGGER.cterror("CTALT00358", dbEx);
		}
		return lastCount;
	}
}
