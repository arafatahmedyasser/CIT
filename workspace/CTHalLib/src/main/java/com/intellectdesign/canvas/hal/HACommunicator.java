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

package com.intellectdesign.canvas.hal;

import java.util.HashMap;

import com.intellectdesign.canvas.constants.infra.InfraConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;

/**
 * 
 * The <code>HACommunicator</code> class calls the exact Bean depending upon the method call. It sends payload data to
 * the formatter class to format it before sending to Host and receiving from Host.
 * 
 * @version 1.0
 */
public class HACommunicator implements ICommunicator
{
	/**
	 * Logger Object used to log information to HostAccessLayer log file
	 */
	private static final Logger logger = Logger.getLogger(HACommunicator.class);

	/** Creates a new instance of HACommunicator */
	public HACommunicator()
	{
	}

	/**
	 * Sends information to Async Job Processor.
	 * 
	 * @param haReq
	 * @param appidConfHM
	 * @return HAResponse
	 * @deprecated This feature is not supported. Please configure as Synch
	 */
	public HAResponse sendToAsync(HARequest haReq, HashMap appidConfHM)
	{
		String methodName = "[HACommunicatior.sendToAsync()]";
		logger.ctinfo("CTHAL00001", methodName);
		HAResponse haResp;
		IFormatter formatter = null;

		int status = -1;
		String errorCode = "";
		String errorMsg = "";

		Object dataIn = null;
		Object dataOut = null;

		PerformanceTimer timer = new PerformanceTimer();
		try
		{
			// Get a Formatter Class. Class name should be defined in APP_HANDLER_MAP Table.
			logger.ctdebug("CTHAL00009", methodName, appidConfHM);
			formatter = getFormatterClass(appidConfHM);

			// Send Payload Data to Formatter before sendig it to Host
			logger.ctdebug("CTHAL00010", methodName);
			timer.startTimer(this.getClass(), "sendToAsync->" + formatter.getClass().getName()
					+ ".formatDataOut for App id '" + haReq.getAppID() + "'");
			dataOut = formatter.formatDataOut(haReq.getData(), appidConfHM);
			timer.endTimer();

			// Call Private sendToAsyncProcess() method and Pass Data Object to
			// formatter before taking it to the CIB
			logger.ctdebug("CTHAL00011", methodName);
			timer.startTimer(this.getClass(), "sendToAsync->" + formatter.getClass().getName()
					+ ".formatDataIn for App id '" + haReq.getAppID() + "'");
			dataIn = formatter.formatDataIn(sendToAsyncProcess(dataOut, appidConfHM), appidConfHM);
			timer.endTimer();

			// Check if the data Object is null or not.. If null then Throw error.
			if (dataIn == null)
			{
				logger.cterror("CTHAL00012");
				throw new HALException(InfraConstants.HAL_ERR_INVALID_DATA_OBJ, "Null Data Object Received.");
			}
			HashMap data = null;

			/*
			 * Async Job Processor will always return HashMap. So Check if it of type HashMap. If not then throw error.
			 */
			if (dataIn instanceof HashMap)
			{
				data = (HashMap) dataIn;
			} else
			{
				throw new HALException(InfraConstants.HAL_ERR_UNKNOWN,
						"Reply Data Object is not an instance of HashMap");

			}
			// Update Status, Error Code and Error Message Variables.
			status = ((Integer) data.get(InfraConstants.STATUS)).intValue();
			logger.ctdebug("CTHAL00013", methodName, status);
			errorCode = (String) data.get(InfraConstants.ERROR_CODE);
			logger.ctdebug("CTHAL00014", methodName, errorCode);
			errorMsg = (String) data.get(InfraConstants.ERROR_MSG);
			logger.ctdebug("CTHAL00015", methodName, errorMsg);
		} catch (HALException hale)
		{
			status = -1;
			errorCode = hale.getErrorCode();
			errorMsg = hale.getErrorMessage();
			logger.cterror("CTHAL00016", hale, methodName, errorCode, errorMsg, haReq);
		} catch (Exception e)
		{
			status = -1;
			errorCode = InfraConstants.HAL_ERR_UNKNOWN;
			errorMsg = e.getMessage();
			logger.cterror("CTHAL00017", e, methodName, errorCode, errorMsg, haReq);
		}

		/*
		 * Create HAResponse object based on the Status, Data, ErrorCode and Error Message
		 */
		haResp = wrapToHAResponse(haReq.getAppID(), status, dataIn, errorCode, errorMsg);

		logger.ctinfo("CTHAL00008", methodName, haResp);
		return haResp;
	}

	/**
	 * Sends information to the Host. Verticals needs to Override this method.
	 * 
	 * @param haReq
	 * @param appidConfHM
	 * @return Object
	 */
	public HAResponse sendToHost(HARequest haReq, HashMap appidConfHM)
	{
		String methodName = "[HACommunicatior.sendToHost()]";
		logger.ctinfo("CTHAL00001", methodName);
		HAResponse haResp;
		IFormatter formatter = null;

		int status = -1;
		String errorCode = "";
		String errorMsg = "";

		Object dataIn = null;
		Object dataOut = null;

		PerformanceTimer timer = new PerformanceTimer();
		try
		{
			logger.ctdebug("CTHAL00009", methodName, appidConfHM);
			formatter = getFormatterClass(appidConfHM);
			logger.ctdebug("CTHAL00010", methodName);
			timer.startTimer(this.getClass(), "sendToHost->" + formatter.getClass().getName()
					+ ".formatDataOut for App id '" + haReq.getAppID() + "'");
			dataOut = formatter.formatDataOut(haReq.getData(), appidConfHM);
			timer.endTimer();
			/*
			 * Changing to call sendToHostEx which provides the same implementation as sendToHost(Obj,HashMap) except
			 * that sendToHostEx is protected dataIn = formatter.formatDataIn( sendToHost( dataOut, appidConfHM ),
			 * appidConfHM );
			 */
			timer.startTimer(this.getClass(), "sendToHost->" + formatter.getClass().getName()
					+ ".formatDataIn for App id '" + haReq.getAppID() + "'");
			dataIn = formatter.formatDataIn(sendToHostEx(dataOut, appidConfHM), appidConfHM);
			timer.endTimer();
			status = 0;

		} catch (HALException hale)
		{
			status = -1;
			errorCode = hale.getErrorCode();
			errorMsg = hale.getErrorMessage();
			logger.cterror("CTHAL00016", hale, methodName, errorCode, errorMsg, haReq);
		} catch (Exception e)
		{
			status = -1;
			errorCode = InfraConstants.HAL_ERR_UNKNOWN;
			errorMsg = e.getMessage();
			logger.cterror("CTHAL00017", e, methodName, errorCode, errorMsg, haReq);
		}
		/*
		 * Changing to call wrapToHAResponseEx which provides the same implementation as wrapToHAResponse except that
		 * the wrapToHAResponseEx method is protected so that the child class's Ex method would be called in case its
		 * overriden haResp = wrapToHAResponse( haReq.getAppID(), status, dataIn, errorCode, errorMsg);
		 */
		haResp = wrapToHAResponseEx(haReq.getAppID(), status, dataIn, errorCode, errorMsg);
		logger.ctinfo("CTHAL00008", methodName, haResp);
		return haResp;
	}
	
	/**
	 * Providing empty implementation so that the protected method can be overriden by child classes to provide specific
	 * implementation.
	 * 
	 * @param Object
	 * @param HashMap
	 * @return Object
	 * @throws HALException
	 */
	protected Object sendToHostEx(Object obj, HashMap appidConfHM) throws HALException
	{
		return obj;
	}

	/**
	 * Sends information to the OI. Verticals needs to Override this method.
	 * 
	 * @param haReq
	 * @param appidConfHM
	 * @return Object
	 */
	public HAResponse sendToOI(HARequest haReq, HashMap appidConfHM)
	{
		String methodName = "[HACommunicatior.sendToOI()]";
		logger.ctinfo("CTHAL00001", methodName);
		HAResponse haResp;
		IFormatter formatter = null;

		int status = -1;
		String errorCode = "";
		String errorMsg = "";

		Object dataIn = null;
		Object dataOut = null;

		PerformanceTimer timer = new PerformanceTimer();
		try
		{
			logger.ctdebug("CTHAL00009", methodName, appidConfHM);
			formatter = getFormatterClass(appidConfHM);
			logger.ctdebug("CTHAL00010", methodName);
			timer.startTimer(this.getClass(), "sendToOI->" + formatter.getClass().getName()
					+ ".formatDataOut for App id '" + haReq.getAppID() + "'");
			dataOut = formatter.formatDataOut(haReq.getData(), appidConfHM);
			timer.endTimer();

			timer.startTimer(this.getClass(), "sendToOI->" + formatter.getClass().getName()
					+ ".formatDataIn for App id '" + haReq.getAppID() + "'");
			dataIn = formatter.formatDataIn(sendToOI(dataOut, appidConfHM), appidConfHM);
			timer.endTimer();
			status = 0;

		} catch (HALException hale)
		{
			status = -1;
			errorCode = hale.getErrorCode();
			errorMsg = hale.getErrorMessage();
			logger.cterror("CTHAL00016", hale, methodName, errorCode, errorMsg, haReq);
		} catch (Exception e)
		{
			status = -1;
			errorCode = InfraConstants.HAL_ERR_UNKNOWN;
			errorMsg = e.getMessage();
			logger.cterror("CTHAL00017", e, methodName, errorCode, errorMsg, haReq);
		}

		haResp = wrapToHAResponse(haReq.getAppID(), status, dataIn, errorCode, errorMsg);
		logger.ctinfo("CTHAL00008", methodName, haResp);
		return haResp;

	}
	
	/**
	 * Calls OI Bean
	 * 
	 * @param obj
	 * @param appidConfHM
	 * @return Object
	 */
	private Object sendToOI(Object obj, HashMap appidConfHM)
	{
		return obj;
	}

	/**
	 * Wraps the given information into HAResponse Object. Implementation same as wrapToHAResponse except that the
	 * method is protected (thus letting child classes call the method for wrapping)
	 * 
	 * @param appid
	 * @param status
	 * @param data
	 * @param errorcode
	 * @param errormessage
	 * @return HAResponse
	 */
	protected HAResponse wrapToHAResponseEx(String appid, int status, Object data, String errorcode, String errormessage)
	{
		return wrapToHAResponse(new HAResponse(), appid, status, data, errorcode, errormessage);

	}

	/**
	 * Wraps the given information into HAResponse Object. Implementation same as wrapToHAResponse except that the
	 * method is protected (thus letting child classes call the method for wrapping)
	 * 
	 * @param haResp
	 * @param appid
	 * @param status
	 * @param data
	 * @param errorcode
	 * @param errormessage
	 * @return HAResponse
	 */
	protected HAResponse wrapToHAResponseEx(HAResponse haResp, String appid, int status, Object data, String errorcode,
			String errormessage)
	{

		String methodName = "[HACommunicatior.wrapToHAResponseEx()]";
		logger.ctinfo("CTHAL00001", methodName);

		if (haResp == null)
		{
			haResp = new HAResponse();
		}

		// Wrap the info into HAResponse Object.
		haResp.setAppID(appid);
		haResp.setStatus(status);
		haResp.setData(data);
		haResp.setErrorCode(errorcode);
		haResp.setErrorMessage(errormessage);
		logger.ctinfo("CTHAL00008", methodName, haResp);
		return haResp;
	}

	/**
	 * Method that calls Async Job Processor Bean
	 * 
	 * @param data
	 * @param appidconf
	 * @return hashMap
	 * @throws HALException
	 */
	protected HashMap sendToAsyncProcess(Object data, HashMap appidconf) throws HALException
	{

		String methodName = "[HACommunicatior.sendToAsyncProcess()]";
		logger.ctinfo("CTHAL00001", methodName);
		logger.cterror("CTHAL00025", methodName, appidconf);
		throw new HALException(InfraConstants.HAL_ERR_UNKNOWN,
				"HAL request is configured as async, but async mode is not supported by HAL.");

		/*
		 * Get the Async Home Class to get information from the property file. Required information from the
		 * orbionedirect.property file are JNDIName, JNDIProvider and JNDIURL. Example entries from the property File:
		 * com.intellectdesign.cib.infra.async.bean.JobProcessorRemoteHome.JNDIName=java:comp/env/ejb/JobProcessor
		 * com.intellectdesign.cib.infra.async.bean.JobProcessorRemoteHome.JNDIProvider=weblogic.jndi.WLInitialContextFactory
		 * com.intellectdesign.cib.infra.async.bean.JobProcessorRemoteHome.JNDIURL=t3://localhost:8900
		 */

		/*
		 * String asyncHomeCls = (String) appidconf.get(InfraConstants.ASYNC_HOME_CLS_NAME); if ((asyncHomeCls == null)
		 * || (asyncHomeCls.trim().equals(""))) { throw new HALException(InfraConstants.HAL_ERR_INVALID_ASYNC_CLS_NAME,
		 * "Invalid Async Home Bean Class Name"); }
		 * 
		 * WorkData workdata;*?
		 * 
		 * /* Check the data that has to be sent to Async Job Processor is WorkData Object or not. Cause Async Job
		 * Processor will always expect request in WorkData Object. If not then Throw error..
		 */
		/*
		 * logger.logDebug(methodName, "Checking if the Data Object is an instance of WorkData or not"); if (data
		 * instanceof WorkData) { workdata = (WorkData) data; } else { throw new
		 * HALException(InfraConstants.HAL_ERR_INVALID_WORKDATA,
		 * "Payload Object is not the instance of WorkData Object"); }
		 * 
		 * try {
		 * 
		 * JobProcessorLocalHome home = (JobProcessorLocalHome) CIBEJBHomeFactory.getInstance().getLocalHome(
		 * JobProcessorLocalHome.class);
		 * 
		 * JobProcessorLocal jobProcessor = home.create(); return jobProcessor.submitJob(workdata);
		 */
		/*
		 * JobProcessorRemoteHome home = ( JobProcessorRemoteHome ) EJBHomeFactory.getInstance().getHome(
		 * JobProcessorRemoteHome.class );
		 * 
		 * JobProcessorRemote jobProcessor = home.create(); return jobProcessor.submitJob( workdata );
		 */
		/*
		 * } catch (ProcessingErrorException pe) { logger.logError(methodName, Utility.getPrintStackTrace(pe)); throw
		 * new HALException(InfraConstants.HAL_ERR_NAMING_EXCEPTION, pe.getMessage());
		 * 
		 * } catch (javax.ejb.CreateException ce) { logger.logError(methodName, Utility.getPrintStackTrace(ce)); throw
		 * new HALException(InfraConstants.HAL_ERR_CANT_CREATE_BEAN, "EJB Create Exception occurred");
		 * 
		 * } catch (Exception e) { logger.logError(methodName, Utility.getPrintStackTrace(e)); throw new
		 * HALException(InfraConstants.HAL_ERR_UNKNOWN, e.getMessage()); }
		 */
	}

	/**
	 * Creates and Returns Formatter Class for the Given appid.
	 * 
	 * @param appidconf
	 * @return IFormatter
	 * @throws HALException
	 */
	private IFormatter getFormatterClass(HashMap appidconf) throws HALException
	{

		String methodName = "[HACommunicatior.getFormatterClass()]";
		logger.ctinfo("CTHAL00001", methodName);

		String formatterName = null;
		Class t = null;
		Object obj = null;

		// Get Formatter Class name defined in Database Table.
		formatterName = (String) appidconf.get(InfraConstants.FORMATTER_CLS_NAME);

		// Check if it is empty or null
		if ((formatterName == null) || (formatterName.trim().equals("")))
		{
			logger.cterror("CTHAL00018", methodName);
			throw new HALException(InfraConstants.HAL_ERR_FORMATTER_CLS_VAL_NULL,
					"Formatter Class information not Found.");
		}

		try
		{
			// Load Formatter Class into JVM.
			logger.ctdebug("CTHAL00019", methodName, formatterName);
			t = Class.forName(formatterName);
		} catch (ClassNotFoundException clnfe)
		{
			logger.cterror("CTHAL00020", clnfe, methodName, formatterName);
			throw new HALException(InfraConstants.HAL_ERR_FORMATTER_CLS_NOT_FOUND, "Formatter Class not found..");
		}

		try
		{
			// Create an instance of Formatter Class from the loaded Class.
			logger.ctdebug("CTHAL00021", methodName, formatterName);
			obj = t.newInstance();
		} catch (InstantiationException inste)
		{
			logger.cterror("CTHAL00022", inste, methodName, formatterName);
			throw new HALException(InfraConstants.HAL_ERR_FORMATTER_CLS_INSTANT, "Can't Instantiate Formatter Class.");
		} catch (IllegalAccessException iae)
		{
			logger.cterror("CTHAL00022", iae, methodName, formatterName);
			throw new HALException(InfraConstants.HAL_ERR_FORMATTER_CLS_INSTANT, "Can't Instantiate Formatter Class.");
		}

		// Check if the created instance of type IFormatter. If not then Throw error.
		logger.ctdebug("CTHAL00023", methodName);
		if (obj instanceof IFormatter)
		{
			logger.ctinfo("CTHAL00002", methodName);
			return (IFormatter) obj;
		} else
		{
			logger.cterror("CTHAL00024", methodName, formatterName);
			throw new HALException(InfraConstants.HAL_ERR_FORMATTER_CLS,
					"Given Formatter Class should implement IFormatter interface.");
		}
	}

	/**
	 * Wraps the given information into HAResponse Object
	 * 
	 * @param appid
	 * @param status
	 * @param data
	 * @param errorcode
	 * @param errormessage
	 * @return HAResponse
	 */
	private HAResponse wrapToHAResponse(String appid, int status, Object data, String errorcode, String errormessage)
	{
		return wrapToHAResponse(new HAResponse(), appid, status, data, errorcode, errormessage);
	}

	/**
	 * Wraps the given information into HAResponse Object
	 * 
	 * @param haResp
	 * @param appid
	 * @param status
	 * @param data
	 * @param errorcode
	 * @param errormessage
	 * @return HAResponse
	 */
	private HAResponse wrapToHAResponse(HAResponse haResp, String appid, int status, Object data, String errorcode,
			String errormessage)
	{

		String methodName = "[HACommunicatior.wrapToHAResponse()]";
		logger.ctinfo("CTHAL00008", methodName);

		if (haResp == null)
		{
			haResp = new HAResponse();
		}

		// Wrap the info into HAResponse Object.
		haResp.setAppID(appid);
		haResp.setStatus(status);
		haResp.setData(data);
		haResp.setErrorCode(errorcode);
		haResp.setErrorMessage(errormessage);
		logger.ctinfo("CTHAL00008", methodName, haResp);
		return haResp;
	}

    
    /**
     * Sends information to the Service Request Processor. Verticals needs to Override this method.
     * @param haReq
     * @param appidConfHM
     * @return Object
     */    
     public HAResponse sendToSR(HARequest haReq, HashMap appidConfHM){
        String methodName = "[HACommunicatior.sendToSR()]";       
        HAResponse haResp;
        IFormatter formatter = null;

        int status = -1;
        String errorCode = "";
        String errorMsg = "";

        Object dataIn = null;
        Object dataOut = null;
        Object respData = null;
        
        try{
            logger.ctdebug("CTHAL00060", methodName);
            formatter = getFormatterClass( appidConfHM ) ;
            logger.ctdebug("CTHAL00061", methodName);
            dataOut = formatter.formatDataOut( haReq.getData(), appidConfHM );
            
            respData = sendToSREx( dataOut, appidConfHM );
            dataIn = formatter.formatDataIn(respData ,appidConfHM );
            status = 0;

        }catch( HALException hale){
            status = -1;
            errorCode =  hale.getErrorCode();
            errorMsg = hale.getErrorMessage();
            logger.cterror("CTHAL00051", methodName,hale);
        }catch( Exception e){
            status = -1;
            errorCode =  InfraConstants.HAL_ERR_UNKNOWN;
            errorMsg = e.getMessage();
            logger.cterror("CTHAL00051", methodName,e);
        }
		/*
		Changing to call wrapToHAResponseEx which provides the same implementation as 
		wrapToHAResponse except that the wrapToHAResponseEx method is protected so that
		the child class's Ex method would be called in case its overriden
        haResp = wrapToHAResponse( haReq.getAppID(), status, dataIn, errorCode,
                        errorMsg);
		*/
        haResp = wrapToHAResponseEx( haReq.getAppID(), status, dataIn, errorCode,
                        errorMsg);
        return haResp;
    }
     
     /**
      * Providing empty implementation so that the protected method can be overriden by child classes to provide specific implementation.
      * @param Object
      * @param HashMap
      * @return Object
      */
     protected  Object sendToSREx(Object obj, HashMap appidConfHM) throws HALException{
     	
     	return obj;
     }
     
     /**
      * Sends information to the Service Request Communicator to fetch details from DB
      * @param haReq
      * @param appidConfHM
      * @return Object
      */
     
	public HAResponse sendToDB(HARequest haReq, HashMap appidConfHM) {
        String methodName = "[HACommunicatior.sendToDB()]";
       
        HAResponse haResp;
        IFormatter formatter = null;

        int status = -1;
        String errorCode = "";
        String errorMsg = "";

        Object dataIn = null;
        Object dataOut = null;
       
        try{
        	logger.ctdebug("CTHAL00060", methodName);
            formatter = getFormatterClass( appidConfHM ) ;
            logger.ctdebug("CTHAL00061", methodName);
            dataOut = formatter.formatDataOut( haReq.getData(), appidConfHM );
			/*
			Changing to call sendToHostEx which provides the same implementation as 
			sendToHost(Obj,HashMap) except that sendToHostEx is protected
            dataIn = formatter.formatDataIn( sendToHost( dataOut, appidConfHM ),
                                             appidConfHM );
			*/
            dataIn = formatter.formatDataIn( sendToDBEx( dataOut, appidConfHM ),appidConfHM );
            status = 0;

        }catch( HALException hale){
            status = -1;
            errorCode =  hale.getErrorCode();
            errorMsg = hale.getErrorMessage();
            logger.cterror("CTHAL00051", methodName,hale);
        }catch( Exception e){
            status = -1;
            errorCode =  InfraConstants.HAL_ERR_UNKNOWN;
            errorMsg = e.getMessage();
            logger.cterror("CTHAL00051", methodName,e);
            
        }
		/*
		Changing to call wrapToHAResponseEx which provides the same implementation as 
		wrapToHAResponse except that the wrapToHAResponseEx method is protected so that
		the child class's Ex method would be called in case its overriden
        haResp = wrapToHAResponse( haReq.getAppID(), status, dataIn, errorCode,
                        errorMsg);
		*/
        haResp = wrapToHAResponseEx( haReq.getAppID(), status, dataIn, errorCode,
                        errorMsg);
        return haResp;
    }
    
    /**
     * Providing empty implementation so that the protected method can be overriden by child classes to provide specific implementation.
     * @param Object
     * @param appidConfHM
     * @return
     * @throws HALException
     */
    protected  Object sendToDBEx(Object obj, HashMap appidConfHM) throws HALException{
		return obj;
	}
}
