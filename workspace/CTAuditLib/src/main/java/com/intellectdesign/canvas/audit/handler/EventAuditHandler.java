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

package com.intellectdesign.canvas.audit.handler;

import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.event.handler.EventHandler;
import com.intellectdesign.canvas.event.handler.HandlerException;
import com.intellectdesign.canvas.event.handler.IData;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.PropertyReader;

/**
 * Performs Audit in Synchronous or asynchronous mode. In Synchronous mode use of JTA is suggested and in Asynchronous
 * mode use of JMS is suggested. The present implementation will be completed only for the synchronous mode and the
 * asynchronous mode will be implemented later.
 *  
 * @version 1.0
 */
public class EventAuditHandler extends EventHandler
{
	/**
	 * Constructor for EventAuditHandler class
	 */
	public EventAuditHandler()
	{
	}

	/**
	 * This method formats the event data
	 * 
	 * @param event
	 * @param mapData
	 * @return IData
	 * @throws AuditHandlerException
	 * @see com.intellectdesign.canvas.shared.constants.handler.EventHandler#formatEventData(com.intellectdesign.canvas.constants.event.Event,
	 *      java.util.HashMap)
	 */
	protected IData formatEventData(Event event, Map mapData) throws AuditHandlerException
	{
		AuditData auditData = new AuditData();
		// First setup the meta data
		setAuditMetaData(event, mapData, auditData);
		// Next prepare the audit details
		setAuditData(event, mapData, auditData);

		return auditData;
	}

	/**
	 * This method will be called from handleEvent when the handler has been configured to execute in a synchronous
	 * manner.
	 * 
	 * @param event the Event that has to be handled
	 * @param eventData The formatted data for this event
	 * @throws HandlerException Thrown if there are any errors while handling this event
	 * @see 
	 *      com.intellectdesign.canvas.shared.constants.handler.EventHandler#handleSynchEvent(com.intellectdesign.canvas.constants.event.
	 *      Event, com.intellectdesign.canvas.shared.constants.IData eventData)
	 */
	protected void handleSynchEvent(Event event, IData eventData) throws HandlerException
	{
		try
		{
			logger.ctdebug("CTAUD00158", "handleSynchEvent");
			// Store Audit Meta Data
			AuditHandlerInstruction instr = new AuditHandlerInstruction();
			instr.insertAuditData((AuditData) eventData);
			logger.ctdebug("CTAUD00159", "handleSynchEvent");
		} catch (DatabaseException dbException)
		{
			logger.cterror("CTAUD00160", dbException, mReader.retrieveProperty("AUD009"));
			throw new HandlerException("AUD009", dbException);
		}
	}

	/**
	 * Sets the mandatory data for the event.
	 * 
	 * @param event
	 * @param mapData
	 * @param auditData
	 * @throws AuditHandlerException
	 */
	private void setAuditMetaData(Event event, Map mapData, AuditData auditData) throws AuditHandlerException
	{
		logger.ctdebug("CTAUD00162", "setAuditMetaData", mapData);
		HashMap mapMetaData = (HashMap) mapData.get(AuditConstants.MANDATORY_AUDIT_META_DATA);
		logger.ctdebug("CTAUD00163", "setAuditMetaData", mapMetaData);
		if (mapMetaData == null)
		{
			logger.cterror("CTAUD00164", "setAuditMetaData", mReader.retrieveProperty("AUD002"));
			throw new AuditHandlerException("AUD002", mReader.retrieveProperty("AUD002"));
		}

		auditData.setLoginId((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_LOGIN_ID));
		auditData.setSSimulationLoginId((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_SIMULATION_USERID));
		auditData.setUserNo((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_USER_NO));
		auditData.setGCIF((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_GCIF));
		auditData.setParentGCIF((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_PARENT_GCIF));
		auditData.setAppServerIP((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_APP_SERVER_IP));
		auditData.setWebserverIP((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_WEB_SERVER_IP));
		auditData.setClientIP((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_CLIENT_IP));
		auditData.setChannel((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_CHANNEL_ID));
		auditData.setBrowserName((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_BROWSER));
		auditData.setEventId(event.getEventId());

		auditData.setOldReferenceNo((String) mapMetaData.get(EventHandlerFrameworkConstants.OLD_REFERENCE_NUMBER));

		auditData.setReferenceNo((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_REFERENCE_NO));
		auditData.setReferenceKey((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_REFERENCE_KEY));
		boolean bSimulationMode = false;
		if (mapMetaData.get(EventHandlerFrameworkConstants.FLD_SIMULATION_MODE) != null)
		{
			bSimulationMode = ((Boolean) mapMetaData.get(EventHandlerFrameworkConstants.FLD_SIMULATION_MODE))
					.booleanValue();
		} else
		{
			bSimulationMode = false;
			logger.cterror("CTAUD00165", "setAuditMetaData");
		}
		auditData.setSimulationMode(bSimulationMode);
		auditData.setSessionId((String) mapMetaData.get(EventHandlerFrameworkConstants.FLD_SESSION_ID));

		auditData.setDeviceBandId((String) mapMetaData.get(EventHandlerFrameworkConstants.DEVICE_BAND_ID));
		auditData.setUserAgent((String) mapMetaData.get(EventHandlerFrameworkConstants.USER_AGENT));
		auditData.setWorkspaceId((String) mapMetaData.get(EventHandlerFrameworkConstants.WORKSPACE_ID));
		auditData.setLayoutId((String) mapMetaData.get(EventHandlerFrameworkConstants.LAYOUT_ID));
		auditData.setWidgetId((String) mapMetaData.get(EventHandlerFrameworkConstants.WIDGET_ID));
		auditData.setGeoLocation((String) mapMetaData.get(EventHandlerFrameworkConstants.GEO_LOCATION));
		auditData.setRequestId((String) mapMetaData.get(EventHandlerFrameworkConstants.REQUEST_ID));
		auditData.setRefererUrl((String) mapMetaData.get(EventHandlerFrameworkConstants.REQUEST_URI));
		auditData.setUDF1((String) mapMetaData.get(EventHandlerFrameworkConstants.UDF1));
		auditData.setUDF2((String) mapMetaData.get(EventHandlerFrameworkConstants.UDF2));
		auditData.setUDF3((String) mapMetaData.get(EventHandlerFrameworkConstants.UDF3));
		auditData.setUDF4((String) mapMetaData.get(EventHandlerFrameworkConstants.UDF4));
		auditData.setUDF5((String) mapMetaData.get(EventHandlerFrameworkConstants.UDF5));
		auditData.setUDF6((String) mapMetaData.get(EventHandlerFrameworkConstants.UDF6));
		auditData.setUDF7((String) mapMetaData.get(EventHandlerFrameworkConstants.UDF7));
		auditData.setUDF8((String) mapMetaData.get(EventHandlerFrameworkConstants.UDF8));
		auditData.setUDF9((String) mapMetaData.get(EventHandlerFrameworkConstants.UDF9));
		auditData.setUDF10((String) mapMetaData.get(EventHandlerFrameworkConstants.UDF10));

	}

	/**
	 * Sets Audit data.
	 * 
	 * @param event
	 * @param map 
	 * @param auditData
	 * @throws AuditHandlerException
	 */
	private void setAuditData(Event event, Map mapData, AuditData auditData) throws AuditHandlerException
	{

		AuditDataFormatter formatter = null;
		boolean shouldAuditOldValues = doesRequireOldValues();
		AuditDataValue auditMasterConfig = auditConfiguration.getAuditDataValue(event.getEventId());
		// To come up with a proper factory for creating the audit formatters.
		formatter = AuditDataFormatter.createNewInstance(auditMasterConfig);

		auditData.setAuditData(formatter.formatAuditData(event, mapData, shouldAuditOldValues));
	}

	private static final Logger logger = Logger.getLogger(EventAuditHandler.class);
	private static PropertyReader mReader = new PropertyReader("CTevent_properties");//Renaming Property File

	private AuditDataConfiguration auditConfiguration = AuditDataConfiguration.getInstance();
}
