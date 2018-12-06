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
package com.intellectdesign.canvas.notes.handler;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.notes.NotesConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.constants.util.TRConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.exceptions.common.OnlineException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.notes.instruction.NotesInstruction;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;

/**
 * This class is for The NotesHandler handles additional initialisation tasks related to cuser operations.
 * 
 * @version 1.0
 */
@SuppressWarnings("rawtypes")
public class NotesHandler extends SimpleRequestHandler
{
	public NotesHandler()
	{
		// super.setLibInstr(new NotesInstruction());
	}

	/**
	 * This process method handles the library related actions.
	 * 
	 * @param object
	 * @return object
	 * @throws ProcessingErrorException
	 */
	@Override
	public ReplyObject processRequest(Vector inVector) throws ProcessingErrorException
	{
		ExtReplyObject reply = null;
		String action = (String) inVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
		if (NotesConstants.SAVE_NOTE.equals(action))
		{
			reply = saveNotes(inVector);
		} else if (NotesConstants.LOAD_NOTE.equals(action))
		{
			reply = loadNotes(inVector);
		}
		return reply;
	}

	/**
	 * Handles the library specific action's operations.
	 * 
	 * @param inVector Vector of input values.
	 * @return extReplyObject
	 * @exception ProcessingErrorException
	 */
	public ExtReplyObject loadNotes(Vector inVector) throws ProcessingErrorException
	{
		ExtReplyObject extReplyObject = null;
		HashMap inputHashMap = new HashMap();
		NotesInstruction instr = new NotesInstruction();
		HashMap notesMap = null;
		String message = null;
		String strLastUpdated = null;
		Date lastUpdated;
		GlobalPreferencesUtil pref = new GlobalPreferencesUtil();
		try
		{
			inputHashMap = (HashMap) getAugmentedCachedHashMap(inVector);
			SimpleDateFormat simpleFormat = new SimpleDateFormat("dd/MM/yyyy");
			String currentDate = simpleFormat.format(new Date());
			inputHashMap.put("CURRENT_DATE", currentDate);
			notesMap = instr.getMessage(inputHashMap);
			message = (String) notesMap.get("MESSAGE");
			lastUpdated = (Date) notesMap.get("NOTES_DATE");
			if (message == null)
			{
				message = "";
			}
			if (lastUpdated == null)
			{
				strLastUpdated = "";
			} else
				strLastUpdated = pref.userPrefFormatDateAndTime(
						(String) inputHashMap.get("USER_PREFEERENCE_DATE_FORMAT") + " "
								+ (String) inputHashMap.get("USER_PREFEERENCE_TIME_FORMAT"),
						(String) inputHashMap.get("TIMEZONE"), lastUpdated);
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTNTS0008", dbException);
			throw new ProcessingErrorException(dbException);
		}
		extReplyObject = new ExtReplyObject();
		extReplyObject.headerMap = new HashMap();
		extReplyObject.headerMap.put("MESSAGE", message);
		extReplyObject.headerMap.put("NOTES_DATE", strLastUpdated);
		return extReplyObject;
	}

	/**
	 * Handles the library specific action's operations.
	 * 
	 * @param inVector Vector of input values.
	 * @return extReplyObject
	 * @exception ProcessingErrorException
	 */
	public ExtReplyObject saveNotes(Vector inVector) throws ProcessingErrorException
	{
		ExtReplyObject extReplyObject = null;
		HashMap inputHashMap = new HashMap();
		HashMap jsonMap = new HashMap();
		NotesInstruction instr = new NotesInstruction();
		GlobalPreferencesUtil pref = new GlobalPreferencesUtil();
		try
		{
			inputHashMap = (HashMap) getAugmentedCachedHashMap(inVector);
			inputHashMap.put("CURRENT_DATE", new Date());
			List notes = instr.get(inputHashMap);
			if (notes != null && notes.size() > 0)
			{
				instr.setData(inputHashMap);
				instr.delete();
			}

			String message = (String) inputHashMap.get("MESSAGE");
			if (message != null && message.trim().length() > 0)
			{
				instr.saveNote(inputHashMap);
				jsonMap.put(
						"NOTES_DATE",
						pref.userPrefFormatDateAndTime((String) inputHashMap.get("USER_PREFEERENCE_DATE_FORMAT") + " "
								+ (String) inputHashMap.get("USER_PREFEERENCE_TIME_FORMAT"),
								(String) inputHashMap.get("TIMEZONE"), (Date) inputHashMap.get("CURRENT_DATE")));
			}
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTNTS0009", dbException);
			throw new ProcessingErrorException(dbException);
		} catch (OnlineException dbException)
		{
			LOGGER.cterror("CTNTS0010", dbException);
			throw new ProcessingErrorException(dbException);
		}
		extReplyObject = new ExtReplyObject();
		extReplyObject.headerMap = new HashMap();
		extReplyObject.headerMap.put("JSON_MAP", jsonMap);
		return extReplyObject;
	}

	/**
	 * this method ref to Reply Obj Lib Process
	 * 
	 * @param input
	 * @return
	 */
	public ReplyObject libProcess(Object input)
	{
		return null;
	}

	/**
	 * refactored method to get the jspfields hashmap from vector either from the 26th index in the vector, if not get
	 * from the last but one the position from the vector
	 * 
	 * @param inputVector
	 * @return the hashpmap present in the vector
	 */
	private static HashMap getFieldsHashMapFromVector(Vector inputVector)
	{
		HashMap map = new HashMap();
		Object cachedHashMapObj = inputVector.get(Integer.parseInt(HASH_MAP_POSITION) + 1);
		if (cachedHashMapObj instanceof HashMap)
			map = (HashMap) cachedHashMapObj;
		else
		{
			cachedHashMapObj = inputVector.get(inputVector.size() + TIConstants.REL_CACHEDMAP_INDEX_IN_VECTOR);
			if (cachedHashMapObj instanceof HashMap)
				map = (HashMap) cachedHashMapObj;
		}
		return map;
	}

	/**
	 * Gets the cached HashMap from InputVector. Same as getJSPHashMap method except that other transaction related data
	 * is also populated in the return HashMap.
	 * 
	 * @param Vector Contains TI framework defined fields in positions ranging from 0 to 28+
	 * 
	 * @param Map Cached HashMap with additional data from Vector
	 * 
	 * @return map
	 */
	protected static Map getAugmentedCachedHashMap(Vector inputVector)
	{
		HashMap map = getFieldsHashMapFromVector(inputVector);
		map.put(JSPIOConstants.INPUT_REFERENCE_NO, inputVector.get(TIConstants.REFERENCE_NO_POS));
		map.put(TRConstants.VER_NO, inputVector.get(VER_NO_POS));
		map.put(TIConstants.TXN_STATUS, inputVector.get(TXN_STATUS_POS));

		map.put(TIConstants.CHANNEL_ID, inputVector.get(10));

		return map;
	}

	private static int VER_NO_POS = 16;
	private static int TXN_STATUS_POS = 15;
	private static String HASH_MAP_POSITION = "26";

	private static Logger LOGGER = Logger.getLogger(NotesHandler.class);
}