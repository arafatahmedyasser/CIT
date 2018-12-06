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
 * */

package com.intellectdesign.canvas.formcontainer.cache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.formcontainer.FormContainerDefinitionException;
import com.intellectdesign.canvas.formcontainer.instruction.FormContainerDefinitionInstruction;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is responsible for fetching form container meta data from database and
 * make it available in cache.
 * 
 * @version 1.0
 */
public class FormContainerMetadataCacheDataBuilder extends CacheDataBuilder
{
	private static final Logger logger = Logger.getLogger(FormContainerMetadataCacheDataBuilder.class);

	/**
	 * This method initializes the cache for form components.
	 * 
	 * @param hashMap - Hashmap of Cached Hashmap of parameters from the client
	 * @return formContainerList - List object that contains the from container meta data
	 * 
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 */
	@Override
	protected final List initializeCache(final HashMap hashMap)
	{
		List formContainerList = new ArrayList();

		try
		{
			formContainerList = getFormContainerMetadata();
			logger.ctdebug("CTFDF00107", formContainerList);

		} catch (FormContainerDefinitionException e)
		{
			logger.cterror("CTFDF00108", e);
		}
		logger.ctdebug("CTFDF00109", formContainerList);

		return formContainerList;
	}

	/**
	 * This method is provided as a hook to validate the cache data. 
	 * If the validation fails it gives null.
	 * 
	 * @param params - Hashmap of parameters from cache for validation
	 * @return String - String value that returns the validation status
	 * 
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	@Override
	protected final String validateParameters(final HashMap params)
	{
		return null;
	}

	/**
	 * This method is provided as a hook for the sub class to check whether 
	 * the form container meta data is uptodate or not.
	 * 
	 * @return true if data is uptodate otherwise false
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#isCacheUptoDate()
	 */
	@Override
	protected final boolean isCacheUptoDate()
	{
		return false;
	}

	/***
	 * This method fetches the form container data from database using the {@link FormContainerDefinitionInstruction} for cache.
	 * 
	 * @return List - List object that contains the Form Container Meta data
	 * 
	 * @throws DatabaseException DatabaseException
	 */
	private List getFormContainerMetadata() throws FormContainerDefinitionException
	{

		List formContainerList = null;

		FormContainerDefinitionInstruction formDefinitionInstr = new FormContainerDefinitionInstruction();
		try
		{
			formContainerList = formDefinitionInstr.getFormContainerDefinition();
			logger.ctdebug("CTFDF00110", formContainerList);

		} catch (FormContainerDefinitionException e)
		{
			logger.cterror("CTFDF00111", e);
			throw e;
		}

		return formContainerList;
	}
}
