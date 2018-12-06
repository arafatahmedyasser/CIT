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

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.Properties;
import java.util.ResourceBundle;
import java.util.Vector;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.NoSuchProviderException;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import com.intellectdesign.canvas.alert.handler.AlertConstants;
import com.intellectdesign.canvas.classicdb.DataManager;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.entitlement.EntlConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.CTProperties;

/**
 * 
 * This class is responsible to send mails to send mail to the given mail ids. 
 * Care should be taken to check that the <code>delivery.properties</code> file contains 
 * the MAILSERVERIP, SMTPPORT and USERID (From Mail Id). 
 * 
 * @version 1.0
 */
public class TxnMailExt
{
	private static ResourceBundle smtpIP = null;
	private static ResourceBundle SR_Bundle = null;

	private static final String MAILSERVERIP = "MAILSERVERIP";
	private static final String SMTPPORT = "SMTPPORT";
	public static String DATASOURCE_JNDI_NAME = EntlConstants.DATA_SOURCE;
	private static javax.mail.Session session = null;

	private static Logger logger = Logger.getLogger(TxnMailExt.class);

	static
	{
		smtpIP = ResourceBundle.getBundle("delivery", new Locale("en", "IN"));
		SR_Bundle = ResourceBundle.getBundle("SR_en");

		Properties props = new Properties();
		props.put("mail.smtp.host", smtpIP.getString(MAILSERVERIP));
		props.put("mail.smtp.auth", "true");
		props.put("mail.smt p.port", smtpIP.getString(SMTPPORT));
		session = javax.mail.Session.getDefaultInstance(props, null);
	}

	/**
	 * This method sends the mail to the report subscribed users using the arguments passed as parameters  
	 * 
	 * @param fromID - String value of From Mail Id. if this value is null, then {@link getBankInternetMailId} will provide the From Mail Id
	 * @param text - String value of the Mail content 
	 * @param toID - String value of valid To Mail ID (multiple values should be comma separated)
	 * @param replyTo - String value of the valid Mail Ids which should be marked as Reply To mail Ids
	 * @param subject - String value of the Mail Subject
	 * @param multi
	 * @param langID - String value of the locale Id (used for finding the From Email in {@link getBankInternetMailId} when fromID is null 
	 * @return returnString - "SUCCESS" if mail sent else "FAIL"
	 * 
	 * @throws Exception
	 * @See {@link javax.mail.Message.RecipientType}  
	 *  
	 */

	public String sendMail(String text, String fromID, String toID, String replyTo, String subject, String multi,
			String langID) throws Exception
	{
		String cmName = " [TxnMailExt.sendMail] ";
		logger.ctinfo(cmName, "CTALT00357");
		InternetAddress[] address;
		InternetAddress[] replyAddress;
		Transport moTrans = null;

		MimeBodyPart mbp1 = new MimeBodyPart();
		MimeBodyPart mbp2 = new MimeBodyPart();
		Multipart mp = new MimeMultipart();

		String ls_Descr = "sdfsfsafsa";
		String ls_FromId = fromID;

		String ls_Discl = smtpIP.getString("MAIL_DISCLAIM_PEND");
		MimeMessage msg = null;
		String returnString = "";
		if (!isMailRequired())
		{
			logger.ctdebug(cmName, "CTALT00360");
			return "SUCCESS";
		}
		try
		{

			logger.ctdebug(cmName, "CTALT00361", toID);

			address = new InternetAddress[1];
			address[0] = new InternetAddress(toID);

			logger.ctdebug("CTALT00362", langID);
			logger.ctdebug("CTALT00363", ls_FromId);

			String lang_ID = langID;
			if (langID.equalsIgnoreCase(""))
			{
				lang_ID = "en_US";
			}

			if (ls_FromId.equalsIgnoreCase(""))
			{
				ls_FromId = getBankInternetMailId(lang_ID);
				logger.ctdebug("CTALT00363", ls_FromId);
			}

			replyAddress = new InternetAddress[1];
			replyAddress[0] = new InternetAddress(ls_FromId);

			msg = new MimeMessage(session);
			moTrans = session.getTransport("smtp");

			mbp1.setText(text);
			mbp2.setText(ls_Discl);
			mp.addBodyPart(mbp1);
			mp.addBodyPart(mbp2);
			msg.setFrom(new InternetAddress(ls_FromId));
			msg.setReplyTo(replyAddress);

			msg.setRecipients(Message.RecipientType.TO, address);
			msg.setSubject(subject);
			msg.setSentDate(new java.util.Date());
			msg.setDescription(ls_Descr);
			msg.setContent(mp);

			logger.ctdebug("CTALT00364", msg, moTrans);

			moTrans.connect(smtpIP.getString(MAILSERVERIP), smtpIP.getString("USERID"), smtpIP.getString("PASS"));
			msg.saveChanges();
			moTrans.sendMessage(msg, msg.getAllRecipients());
			moTrans.close();

			returnString = "SUCCESS";

		} catch (AddressException ae)
		{
			returnString = "FAIL";
			logger.cterror("CTALT00352", ae, "AddressException");
		} catch (NoSuchProviderException ne)
		{
			returnString = "FAIL";
			logger.cterror("CTALT00352", ne, "NoSuchProviderException");
		} catch (MessagingException me)
		{
			returnString = "FAIL";
			logger.cterror("CTALT00352", me, "MessagingException");
		} catch (Exception e)
		{
			returnString = "FAIL";
			logger.cterror("CTALT00352", e, "Exception");
		}
		return returnString;
	}

	/**
	 * To get the form pending text
	 * 
	 * @param input
	 * @param refNo
	 * @param txnStatus
	 * @param txnErrorCode
	 * @param replyObject
	 * @return String
	 */
	public String formPendingText(Object input, String refNo, String txnStatus, String txnErrorCode,
			ReplyObject replyObject)
	{
		StringBuffer authorizers = new StringBuffer();
		String cmName = " [TxnMailExt.formPendingText] ";
		logger.ctinfo(cmName, "CTALT00354");
		Vector inputVector = (Vector) input;

		String classId = "";
		int row = 0;

		String txnCode = null;

		String mailstatus = "";
		txnCode = (String) inputVector.get(1);

		if (txnStatus.equalsIgnoreCase("AO") || txnStatus.equalsIgnoreCase("AH"))
		{

			mailstatus = SR_Bundle.getString("mail3");
		} else if (txnStatus.equalsIgnoreCase("IO"))
		{

			mailstatus = SR_Bundle.getString("mail5");
			if (replyObject != null)
			{
				if (replyObject.sRepeater != null)
				{
					row = replyObject.sRepeater.length;
					if (row > 0)
					{
						authorizers.append("<table>");
						authorizers.append("<tr>");
						authorizers.append("<th width=40% id=columnheader>" + SR_Bundle.getString("Role") + "</th>");
						authorizers.append("<th id=columnheader>" + SR_Bundle.getString("Authorizers") + "</th>");
					}
					for (int i = 0; i < row; i++)
					{
						if (i % 2 == 0)
							classId = "ip3";
						else
							classId = "ip4";

						authorizers.append("<tr id=" + classId + ">");
						authorizers.append("<td>" + replyObject.sRepeater[i][1] + "</td>");
						authorizers.append("<td>" + replyObject.sRepeater[i][2] + "</td>");
						authorizers.append("</tr>");
					}
					if (row > 0)
					{
						authorizers.append("</table>");
					}
				}
			}
		}
		StringBuffer lmailBody = new StringBuffer(SR_Bundle.getString("mail1"));
		lmailBody.append(SR_Bundle.getString(txnCode + "_MAIL")); // Txn type
		lmailBody.append(" ");
		lmailBody.append(SR_Bundle.getString("mail2"));
		lmailBody.append(" ");
		lmailBody.append(refNo); // OD reference number
		lmailBody.append(" ");
		lmailBody.append(mailstatus);
		lmailBody.append(" ");
		lmailBody.append(SR_Bundle.getString("Signoff_Message"));
		lmailBody.append("<br><br>");
		lmailBody.append(authorizers);

		logger.ctdebug("CTALT00365", lmailBody);
		return lmailBody.toString();
	}

	/**
	 * This method is used to get the mail ID
	 * 
	 * @param makerID
	 * @param dbConnection
	 * @return String
	 */
	/*
	 * public String getMailID(String makerID, Connection dbConnection) { DataManager dataManager = null; ResultSet rs =
	 * null; PreparedStatement ps = null; Hashtable ht = null; String email = new String(); String cmName =
	 * "TxnMailExt.getMailID()"; logger.logEntry(cmName, "Entered into Method"); String sql =
	 * "select DISTINCT EMAIL_ID from OD_USERS_MB where OD_USER_NO = #USER_NO#"; try {
	 * 
	 * dataManager = getConnection(); dataManager.closeConnection(); dataManager.setConnection(dbConnection);
	 * 
	 * ht = new Hashtable(); ht.put("USER_NO", makerID);
	 * 
	 * ps = dataManager.getProductVector(sql, ht);
	 * 
	 * // getting records from result set rs = ps.executeQuery();
	 * 
	 * if (rs.next()) { email = rs.getString(1); }
	 * 
	 * } catch (Exception e) { logger.logError(cmName, LoggerUtil.getPrintStackTrace(e)); } finally { try { // closing
	 * resultset, prepared statement and connection if (rs != null) rs.close(); if (ps != null) ps.close();
	 * 
	 * } catch (Exception ex) { logger.logError(cmName, LoggerUtil.getPrintStackTrace(ex)); } }
	 * 
	 * return email; }
	 */

	/**
	 * Thi method is used to get the mail ID
	 * 
	 * @param makerID
	 * @return String
	 */
	/*
	 * public String getMailID(String makerID) {
	 * 
	 * ResultSet rs = null; PreparedStatement ps = null;
	 * 
	 * Connection conn = null; String email = new String(); String cmName = "TxnMailExt.getMailID()";
	 * logger.logEntry(cmName, "Entered into Method");
	 * 
	 * String sql = "select DISTINCT EMAIL_ID from OD_USERS_MB where OD_USER_NO = ?"; try {
	 * 
	 * DataManager dataManager = new DataManager();
	 * 
	 * conn = dataManager.getConnection();
	 * 
	 * // getting records from result set ps = conn.prepareStatement(sql); ps.setString(1, makerID);
	 * 
	 * rs = ps.executeQuery();
	 * 
	 * if (rs.next()) { email = rs.getString(1); }
	 * 
	 * } catch (Exception e) { logger.logError(cmName, LoggerUtil.getPrintStackTrace(e));
	 * 
	 * } finally { try { // closing resultset, prepared statement and connection if (rs != null) rs.close(); if (ps !=
	 * null) ps.close(); if (conn != null) conn.close(); // closeConnection(dataManager); } catch (Exception ex) {
	 * logger.logError(cmName, LoggerUtil.getPrintStackTrace(ex)); } }
	 * 
	 * return email; }
	 */

	/**
	 * This method is used to get the mail IDs
	 * 
	 * @param Connection
	 * @param role
	 * @return Hashtable
	 */
	/*
	 * public Hashtable getMaildIDs(Connection con, String role) { String cmName = "TxnMailExt.getMailIDs()";
	 * logger.logEntry(cmName, "Entered into Method"); ResultSet rs = null; Hashtable ht = new Hashtable();
	 * PreparedStatement ps = null;
	 * 
	 * String sql = "select DISTINCT A.OD_USER_NO , A.EMAIL_ID from OD_USERS_MB A where OD_USER_NO  " +
	 * "IN (select OD_USER_NO FROM OD_USER_ROLES_MAP_MB B where OD_ROLE_LEVEL =? " + "A.OD_USER_NO=B.OD_USER_NO)"; try {
	 * ps = con.prepareStatement(sql); ps.setString(1, role);
	 * 
	 * rs = ps.executeQuery();
	 * 
	 * if (rs.next()) { ht.put(rs.getString(1), rs.getString(2)); } } catch (SQLException se) { logger.logError(cmName,
	 * LoggerUtil.getPrintStackTrace(se)); } catch (Exception e) { logger.logError(cmName,
	 * LoggerUtil.getPrintStackTrace(e)); } finally { try { if (rs != null) rs.close(); if (ps != null) ps.close(); }
	 * catch (Exception ee) { logger.logError(cmName, LoggerUtil.getPrintStackTrace(ee)); } } return ht; }
	 */

	/**
	 * This method is used to get the mail IDs
	 * 
	 * @param Connection
	 * @param role
	 * @return String
	 */
	/*
	 * public String getMailIDs(Connection con, String role) { String cmName = "TxnMailExt.getMailIDs()";
	 * logger.logEntry(cmName, "Entered into Method"); ResultSet rs = null; PreparedStatement ps = null; String emails =
	 * ""; String sql = "select DISTINCT A.OD_USER_NO , A.EMAIL_ID from OD_USERS_MB A where OD_USER_NO  " +
	 * "IN (select OD_USER_NO FROM OD_USER_ROLES_MAP_MB B where OD_ROLE_LEVEL =? " + "A.OD_USER_NO=B.OD_USER_NO)";
	 * 
	 * try { ps = con.prepareStatement(sql); ps.setString(1, role);
	 * 
	 * rs = ps.executeQuery();
	 * 
	 * if (rs.next()) { if (rs.getString(2) != "") { emails += rs.getString(2) + ","; } } } catch (SQLException se) {
	 * logger.logError(cmName, LoggerUtil.getPrintStackTrace(se));
	 * 
	 * } catch (Exception e) { logger.logError(cmName, LoggerUtil.getPrintStackTrace(e));
	 * 
	 * } finally { try { if (rs != null) rs.close(); if (ps != null) ps.close(); } catch (Exception ee) {
	 * logger.logError(cmName, LoggerUtil.getPrintStackTrace(ee)); } } return emails; }
	 */

	/**
	 * This method is used to get the BankMailId
	 * 
	 * @param langID
	 * @return String
	 */
	/*
	 * public String getBankMailId(String langID) { String cmName = "TxnMailExt.getBankMailId()";
	 * logger.logEntry(cmName, "Entered into Method"); String mailId = "";
	 * 
	 * Connection conn = null; PreparedStatement ps = null; ResultSet rs = null;
	 * 
	 * String strQuery = "";
	 * 
	 * try {
	 * 
	 * strQuery = TxnSQLMaster.GET_BANK_MAIL_ID; DataManager dataManager = new DataManager();
	 * 
	 * conn = dataManager.getConnection(); ps = conn.prepareStatement(strQuery); ps.setString(1, langID); rs =
	 * ps.executeQuery(); if (rs.next()) { mailId = rs.getString(1); }
	 * 
	 * }// end of try statement catch (SQLException sqlException) {
	 * 
	 * logger.logError(cmName, LoggerUtil.getPrintStackTrace(sqlException)); } catch (Exception exception) {
	 * 
	 * logger.logError(cmName, LoggerUtil.getPrintStackTrace(exception)); } finally {
	 * 
	 * try { // closing resultset, prepared statement and connection if (rs != null) rs.close(); if (ps != null)
	 * ps.close(); if (conn != null) conn.close();
	 * 
	 * } catch (Exception ex) { logger.logError(cmName, LoggerUtil.getPrintStackTrace(ex)); } } return mailId; }
	 */

	/**
	 * This method fetches the banks valid Mail Id to be used as From Mail id in {@link sendMail}
	 * 
	 * @param langID - String value of the Locale Id
	 * @return mailId - Valid Email ID fetched from DB
	 */
	public String getBankInternetMailId(String langID)
	{
		String cmName = "TxnMailExt.getBankInternetMailId()";
		logger.ctinfo("CTALT00357");
		String mailId = "";
		DatabaseRequest dbRequest = null;
		try
		{

			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey("GET_BANK_NETMAIL_ID");
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension("TXN_MAIL");

			dbRequest.addFilter("OD_LANG_ID", langID);

			List bankMail = dbRequest.execute().getReturnedList();
			Iterator itr = bankMail.listIterator();
			if (bankMail != null && bankMail.isEmpty())
			{
				while (itr.hasNext())
				{
					mailId = (String) itr.next();
				}
			}

		} catch (Exception exception)
		{
			logger.cterror("CTALT00352", exception, "Exception");
		}
		return mailId;
	}

	/*
	 * Method: getContactDetails() Fetches the contact details from the System parameters
	 */

	/**
	 * This method is used to get the contact details
	 * 
	 * @param langID
	 * @return HashMap
	 */
	/*
	 * public HashMap getContactDetails(String langID) { String cmName = "TxnMailExt.getContactDetails()";
	 * logger.logEntry(cmName, "Entered into Method"); String paramCode = ""; String paramVal = ""; DataManager
	 * dataManager = null; Connection conn = null; PreparedStatement ps = null; ResultSet rs = null; HashMap cntMap =
	 * null;
	 * 
	 * String strQuery = "";
	 * 
	 * try {
	 * 
	 * cntMap = new HashMap(); strQuery = TxnSQLMaster.GET_BANK_COTNACT_DETAILS; dataManager = new DataManager(); conn =
	 * dataManager.getConnection(); ps = conn.prepareStatement(strQuery); ps.setString(1, langID); rs =
	 * ps.executeQuery();
	 * 
	 * while (rs.next()) {
	 * 
	 * paramCode = rs.getString(1); paramVal = rs.getString(2); cntMap.put(paramCode, paramVal); }
	 * 
	 * }// end of try statement catch (SQLException sqlException) { logger.logError(cmName,
	 * LoggerUtil.getPrintStackTrace(sqlException)); } catch (Exception exception) { logger.logError(cmName,
	 * LoggerUtil.getPrintStackTrace(exception)); } finally {
	 * 
	 * try { if (rs != null) rs.close(); if (ps != null) ps.close(); if (conn != null) conn.close(); } catch (Exception
	 * ex) { logger.logError(cmName, LoggerUtil.getPrintStackTrace(ex)); } } logger.logEntry(cmName, "Retrun MAP cntMap"
	 * + cntMap); return cntMap; }
	 */

	/**
	 * This method gets the db connection for handling db requests 
	 * 
	 * @return dataManager - DataManager object which can be used for handling db request
	 */
	private DataManager getConnection()
	{

		DataManager dataManager = null;
		String cmName = "TxnMailExt.getConnection()";
		logger.ctinfo("CTALT00357");
		try
		{

			dataManager = new DataManager();

		} catch (Exception exception)
		{
			logger.cterror("CTALT00352", exception, "Exception");

		}
		return dataManager;
	}

	/**
	 * This method stores all the details of the mails in DB before sending to the mail server.
	 * 
	 * @param mailValueObj - MailDataValue object that contains the data such as From, To, CC, BCC and Reply To Mail ID...etc 
	 * 
	 */

	public void storeMail(MailDataValue mailValueObj)
	{
		String cmName = "TxnMailExt.storeMail()";
		logger.ctinfo("CTALT00357");
		DatabaseRequest databaseRequest = null;
		HashMap hmMailDataMap = new HashMap();
		hmMailDataMap.put(AlertConstants.OD_TO_ID, mailValueObj.gettoID());
		hmMailDataMap.put(AlertConstants.OD_MAIL_BODY, mailValueObj.getbody());
		hmMailDataMap.put(AlertConstants.OD_FROM_ID, mailValueObj.getfromId());
		hmMailDataMap.put(AlertConstants.OD_MAIL_SUBJECT, mailValueObj.getsubject());
		hmMailDataMap.put(AlertConstants.OD_REPLY_TO, mailValueObj.getreplyTo());
		hmMailDataMap.put(AlertConstants.OD_CC_TO, mailValueObj.getCC());
		hmMailDataMap.put(AlertConstants.OD_BCC_TO, mailValueObj.getBCC());
		hmMailDataMap.put(AlertConstants.OD_BULK_MAIL, mailValueObj.getbulk());
		hmMailDataMap.put(AlertConstants.OD_PATH, mailValueObj.getpath());
		hmMailDataMap.put(AlertConstants.PASSWORD_PROTECTED, mailValueObj.getPasswordProtectedValue());

		try
		{
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(AlertConstants.MAIL_FRMWRK_DAM_KEY);
			databaseRequest.setOperation(DatabaseConstants.INSERT);
			databaseRequest.setOperationExtension(AlertConstants.ADD_TO_PENDING_MAIL);
			databaseRequest.setData(hmMailDataMap);
			databaseRequest.execute();
 			mailValueObj.setStatus("S");
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTALT00370", dbEx);
		}
	}

	/**
	 * This method updateMailStatus() updates the status of the mails
	 * 
	 * @param : MailMastVal
	 * @return : void
	 */

	/*
	 * public void updateMailStatus(MailMasterValue mailmastVal) { String cmName = "TxnMailExt.updateMailStatus()";
	 * logger.logEntry(cmName, "Entered into Method"); String strQuery = ""; PreparedStatement ps = null;
	 * 
	 * Connection mailConn = null; int refId = 0; DataManager dManage = null; if (!isMailRequired()) {
	 * logger.logDebug(cmName, "Not sending mail as the mail config is set to No"); return; } try { dManage = new
	 * DataManager(); mailConn = dManage.getConnection(); strQuery = TxnSQLMaster.UPDATE_MAIL_STATUS; ps =
	 * mailConn.prepareStatement(strQuery); refId = mailmastVal.getRefId();
	 * 
	 * ps.setString(1, "Y"); ps.setInt(2, refId); ps.executeUpdate(); } catch (SQLException sqx) {
	 * logger.logError(cmName, LoggerUtil.getPrintStackTrace(sqx)); } catch (Exception ex) { logger.logError(cmName,
	 * LoggerUtil.getPrintStackTrace(ex)); } finally { try { if (ps != null) ps.close(); if (mailConn != null)
	 * mailConn.close(); } catch (Exception e) { logger.logError(cmName, LoggerUtil.getPrintStackTrace(e)); } } }
	 */

	/**
	 * This method gets UserMailId
	 * 
	 * @param : userNo
	 * @return : userEmailID
	 */

	/*
	 * public String getUserMailId(String userNo) { String mLog = "TxnMailExt:getUserMailId"; logger.logEntry(mLog,
	 * " Entered..........."); Connection conUser = null; PreparedStatement psUser = null; DataManager dManage = null;
	 * ResultSet rsUser = null;
	 * 
	 * String userEmailID = ""; String sql = "SELECT EMAIL_ID FROM OD_USERS_MB WHERE OD_USER_NO= ?";
	 * logger.logDebug(mLog, " userNo" + userNo); try {
	 * 
	 * dManage = new DataManager(); conUser = dManage.getConnection(); psUser = conUser.prepareStatement(sql);
	 * psUser.setString(1, userNo.trim()); rsUser = psUser.executeQuery();
	 * 
	 * while (rsUser.next()) { userEmailID = rsUser.getString(1); } } catch (Exception e) { logger.logError(mLog,
	 * LoggerUtil.getPrintStackTrace(e)); } finally { try { if (rsUser != null) rsUser.close(); if (psUser != null)
	 * psUser.close(); if (conUser != null) conUser.close();
	 * 
	 * } catch (SQLException se) { logger.logError(mLog, LoggerUtil.getPrintStackTrace(se)); } } logger.logDebug(mLog,
	 * " userEmailID" + userEmailID); return userEmailID; }
	 */

	/**
	 * This method checks whether Mail Configuration Required or not based on value of the key IS_MAIL_CONFIG_REQUIRED in CT.properties 
	 * 
	 * @return true if value required otherwise false
	 */
	private boolean isMailRequired()
	{
		String flagrequired = null;
		boolean isFlagRequired = false;
		try
		{
			flagrequired = CTProperties.getProperty("IS_MAIL_CONFIG_REQUIRED");
			if (flagrequired != null && flagrequired.equalsIgnoreCase("Y"))
			{
				isFlagRequired = true;
			}
		} catch (MissingResourceException mrex)
		{
			isFlagRequired = true;
		}
		return isFlagRequired;
	}
}
