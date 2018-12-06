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
 */
package com.intellectdesign.canvas.report.publisher;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.alert.handler.AlertHandlerException;
import com.intellectdesign.canvas.alert.mail.MailDataValue;
import com.intellectdesign.canvas.alert.mail.TxnMailExt;
import com.intellectdesign.canvas.alert.smtp.SmtpChannelHandler;
import com.intellectdesign.canvas.alert.smtp.SmtpMessageRecipient;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * This class is used to Publish the report by Mail
 * 
 * @version 1.0
 */

public class MailReportPublisher implements IReportPublisher
{
	/**
	 * This method used to publish the report through Mail.
	 * 
	 * @param response - contains the reportDetails like reportName, report instance id, UserId (ie) recipient userId
	 * @throws ReportingException
	 */
	public void publish(ReportResponse reportResponse) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00432");

		SmtpMessageRecipient msgRecipient = null;
		MailDataValue mailValueObj = null;
		TxnMailExt mailext = null;

		/**
		 * Step 1: Get Report Details from reportResponse Object.
		 */

		List mailContentValueList = getMailContentValueList(reportResponse);

		try
		{
			Map responseMap = reportResponse.getResponseObject();
			String strLocale = (String) responseMap.get(PreferenceConstants.LANGUAGE_ID);
			String sourcepath = (String) responseMap.get(ReportConstants.REPORT_REF_LOCATION);

			/**
			 * Get SmtpMessageRecipient object for the userId from from DB. (i.e) recipient's userId, gcif, email id
			 */
			List recipient = getRecipientDtls(responseMap);
			Iterator recipientIterator = recipient.iterator();

			mailext = new TxnMailExt();

			while (recipientIterator.hasNext())
			{

				/**
				 * Get Recipient details t
				 */
				msgRecipient = (SmtpMessageRecipient) recipientIterator.next();
				String toId = msgRecipient.getEmailId();

				if (toId == null || toId.trim().length() == 0)
				{
					LOGGER.ctdebug("CTREP00433");
					// To_Id not available. So Skip the current mail record and continue the next mailRecord in
					// listEMailDetails.
				} else
				{
					/**
					 * Form the MailValueObject and call storeMail(MailDataValue mailValueObj) to stores all the details
					 * of the mail.
					 */
					ConfigurationManager config = ConfigurationManager.getInstance();
					mailValueObj = new MailDataValue();
					mailValueObj.settoID(toId);
					mailValueObj.setfromId(config.getInformationReportingDescriptor().getSenderEmailId());
					mailValueObj.setbody(ReportUtil.getMessage(ReportConstants.RFW_MAIL_BODY, strLocale,
							mailContentValueList));
					mailValueObj.setsubject(ReportUtil.getMessage(ReportConstants.RFW_MAIL_SUBJECT, strLocale,
							mailContentValueList));
					mailValueObj.setreplyTo(ReportConstants.EMPTY_STR);
					mailValueObj.setCC(ReportConstants.EMPTY_STR);
					mailValueObj.setBCC(ReportConstants.EMPTY_STR);
					mailValueObj.setpath(sourcepath);
					mailValueObj.setbulk(ReportConstants.NO_IND);
					mailValueObj.setPasswordProtected(ReportConstants.NO_IND); // No need to PASSWORD_PROTECTED for
																				// ReportFW's mail attachment files

					mailext.storeMail(mailValueObj);
				}

			}

		} catch (AlertHandlerException alertHandlerExp)
		{
			LOGGER.cterror("CTREP00434", alertHandlerExp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_PUBLISHER_FAILED, alertHandlerExp);
		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00434", exp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_PUBLISHER_FAILED, exp);
		}
		LOGGER.ctinfo("CTREP00435");
	}

	/**
	 * Util method to bundle the reportName and Report Ref no as list for mail-subject and mail-body text form.
	 * 
	 * @param reportResponse
	 * @return List
	 */
	private List getMailContentValueList(ReportResponse reportResponse)
	{

		List mailContentValueList = new ArrayList();

		mailContentValueList.add(reportResponse.getReportName());
		mailContentValueList.add(new Date().toString());
		mailContentValueList.add(reportResponse.getReportInstanceId());

		return mailContentValueList;

	}

	/**
	 * Used to get list of Recipient details from for the users.
	 * 
	 * @param responseMap - contains the recipient userId
	 * @return list of SmtpMessageRecipient object
	 * @throws AlertHandlerException
	 */
	private List getRecipientDtls(Map responseMap) throws AlertHandlerException
	{
		String user_no = responseMap.get(ReportConstants.OD_USER_NO).toString(); // As of now it will have the current
																					// userNo only.
		ArrayList userid = new ArrayList<String>(Arrays.asList(user_no.split(",")));

		SmtpChannelHandler scHandler = new SmtpChannelHandler();
		return scHandler.getRecipientsInfoFromDB(userid);
	}

	// instantiating logger object.
	private static Logger LOGGER = Logger.getLogger(MailReportPublisher.class);

}
