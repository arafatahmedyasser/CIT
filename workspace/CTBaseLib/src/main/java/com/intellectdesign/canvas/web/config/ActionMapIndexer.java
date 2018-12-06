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
package com.intellectdesign.canvas.web.config;

import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistry;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer;

/**
 * This is the default Action Map indexer provided by the Canvas Platform. This indexer uses only Screen code as the
 * basis for the indexing. In case the provided action mapping in the registry has multiple entries for the same screen
 * code, then the most recent entry added to the registry will be returned when a lookup is done using this indexer
 * 
 * @version 1.0
 */
public class ActionMapIndexer implements ICanvasRegistryIndexer
{
	private Map<String, ActionMap> localIndex = null;
	@SuppressWarnings("unused")
	private ICanvasRegistry actionRegistry = null;

	public ActionMapIndexer()
	{
		localIndex = new HashMap<String, ActionMap>();
	}

	/**
	 * Here, we update the index with the new contentAdded.
	 * 
	 * @param aContent The new content being added
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryListener#contentAdded(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	public void contentAdded(ICanvasRegistryContent aContent) throws BaseException
	{
		if (aContent instanceof ActionMap)
		{
			ActionMap actionMap = (ActionMap) aContent;
			String indexKey = actionMap.getScreenCode();
			localIndex.put(indexKey, actionMap);
		}
	}

	/**
	 * this method ref to RemovedContentActionMapIndexer
	 * 
	 * @param aContent
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryListener#contentRemoved(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	public void contentRemoved(ICanvasRegistryContent aContent) throws BaseException
	{
		if (aContent instanceof ActionMap)
		{
			ActionMap actionMap = (ActionMap) aContent;
			String indexKey = actionMap.getScreenCode();
			// If the content in index is same object as that passed, then remove the same.
			if (localIndex.containsValue(aContent))
				localIndex.remove(indexKey);
		}
	}

	/**
	 * this method ref to ReplaceingContent
	 * 
	 * @param oldContent
	 * @param newContent
	 * @return
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryListener#contentReplacing(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent,
	 *      com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	public boolean contentReplacing(ICanvasRegistryContent oldContent, ICanvasRegistryContent newContent)
			throws BaseException
	{
		contentRemoved(oldContent);
		contentAdded(newContent);
		return true;
	}

	/**
	 * this method ref to ICanvasRegistryContent matchItem object
	 * 
	 * @param args
	 * @return
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer#match(java.lang.Object[])
	 */
	@Override
	public ICanvasRegistryContent match(Object... args)
	{
		ICanvasRegistryContent matchItem = null;
		String indexKey = "";
		if (args.length > 0)
		{
			// Read only the first argument and that too is expected to be a String. Else convert the same to a String
			// and then search
			indexKey = args[0] != null ? args[0].toString() : "";
		}
		if (localIndex.containsKey(indexKey))
			matchItem = localIndex.get(indexKey);

		return matchItem;
	}

	/**
	 * this method ref to SetRegistry to parentRegistry
	 * 
	 * @param parentRegistry
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer#setRegistry(com.intellectdesign.canvas.spec.registry.ICanvasRegistry)
	 */
	@Override
	public void setRegistry(ICanvasRegistry parentRegistry)
	{
		actionRegistry = parentRegistry;
	}

}
