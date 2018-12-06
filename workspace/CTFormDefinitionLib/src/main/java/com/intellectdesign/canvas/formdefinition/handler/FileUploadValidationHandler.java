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

package com.intellectdesign.canvas.formdefinition.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.formdefinition.FormDefinitionException;
import com.intellectdesign.canvas.formdefinition.FormDefinitionInstruction;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;

/**
 * This class is for file upload validation handler extends simple request handler.
 * 
 * @version 1.0
 */
public class FileUploadValidationHandler extends SimpleRequestHandler
{

	private static final Logger logger = Logger.getLogger(FileUploadValidationHandler.class);

	/**
	 * This method processes the user request.
	 * 
	 * @see com.orbidirect.aps.handler.RequestHandler#process(java.lang.Object)
	 * 
	 * @param obj - Class object that contains the File Upload 
	 * 
	 * @throws ProcessingException
	 * 
	 * @return reply - object
	 */
	@Override
	public ReplyObject processRequest(Vector inputVector) throws ProcessingErrorException
	{
		logger.ctinfo("CTFDF00013");
		PerformanceTimer perfTimer = new PerformanceTimer();
		ReplyObject reply = null;
		perfTimer.startTimer("FileUploadValidationHandler.process");
		// Get the action from the Vector and check whether it is one of the
		// supported custom actions.
		String action = (String) ((HashMap) inputVector.get(15)).get("INPUT_ACTION");
		if ("GET_MIME_TYPES".equals(action))
		{
			reply = processGetMimeTypesFor(inputVector);
		}
		logger.ctinfo("CTFDF00013");
		return reply;
	}

	/**
	 * This method gets the mime types for upload file validation.
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * @return reply - ReplyObject containing the list of mime types for file upload validation
	 */
	private ReplyObject processGetMimeTypesFor(Vector inputVector)
	{
		logger.ctinfo("CTFDF00014");
		ExtReplyObject reply = null;
		List<String> formList = null;
		HashMap formDefnMap = null;
		String formId = (String) ((HashMap) inputVector.get(15)).get("FORM_ID");
		String itemId = (String) ((HashMap) inputVector.get(15)).get("FORM_ITEM_ID");
		try
		{
			formList = new ArrayList<String>();
			formList.add(formId);
			FormDefinitionInstruction formInstr = new FormDefinitionInstruction();
			formDefnMap = (HashMap) formInstr.getFormMetaDataForExport(formList);
			reply = new ExtReplyObject();
			reply.headerMap = new HashMap();
			reply.headerMap.put("FORM_ITEM_FILE_UPLOAD_DATA", formDefnMap.get(formId + "|||" + itemId));

		} catch (FormDefinitionException formDefException)
		{
			logger.cterror("CTFDF00015", formDefException);
		}
		logger.ctinfo("CTFDF00014");
		return reply;
	}

}
