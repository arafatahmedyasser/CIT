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

package com.intellectdesign.canvas.spec.registry;

import java.util.Iterator;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.spec.CanvasListenerList;

/**
 * This is a default base class for the registry that is created with ready made support for registering listeners,
 * raising events, etc.
 * 
 * @version 1.0
 */
public abstract class CanvasRegistryBase implements ICanvasRegistry
{
	private ICanvasRegistryIndexer indexer;
	private CanvasListenerList<ICanvasRegistryListener> listenerList = null;

	/**
	 * The only constructor for the base class. Always expects the indexer to be provided.
	 * 
	 * @param indexr The indexer to be used for this registry
	 */
	public CanvasRegistryBase(ICanvasRegistryIndexer indexr)
	{
		// Store the indexer
		this.indexer = indexr;
		this.indexer.setRegistry(this);
		// Initialise the lister list
		this.listenerList = new CanvasListenerList<ICanvasRegistryListener>();
		// Add the indexer as a default listener
		this.listenerList.addListener(indexer);
	}

	/**
	 * Adds the provided listener to this registry
	 * 
	 * @param aListener The listener to be added
	 */
	public void addListener(ICanvasRegistryListener aListener)
	{
		if (!listenerList.hasListener(aListener))
			listenerList.addListener(aListener);
	}

	/**
	 * Removes the provided listener from this registry
	 * 
	 * @param aListener The listener to be removed
	 */
	public void removeListener(ICanvasRegistryListener aListener)
	{
		listenerList.removeListener(aListener);
	}

	/**
	 * This is the actual implementation to be done by the sub classes for registering a content.
	 * 
	 * @param aContent The content to be registered
	 * @return true, if the content got added to the registry. false otherwise
	 * @throws BaseException Thrown if any error occurs while adding the content to the registry
	 */
	protected abstract boolean registerImpl(ICanvasRegistryContent aContent) throws BaseException;

	/**
	 * This is the actual implementation to be done by the sub classes for replacing a content with the newer version
	 * provided.
	 * 
	 * @param origContent The content that should be replaced
	 * @param aContent The newer version of the content to be updated into registry
	 * @throws BaseException Thrown if any error occurs while adding the content to the registry
	 */
	protected abstract void replaceContent(ICanvasRegistryContent origContent, ICanvasRegistryContent aContent)
			throws BaseException;

	/**
	 * This is the actual implementation to be done by the sub classes for unregistering a content.
	 * 
	 * @param aContent The content to be unregistered
	 * @return true, if the content got removed from the registry. false otherwise
	 * @throws BaseException Thrown if any error occurs while removing the content to the registry
	 */
	protected abstract boolean unregisterImpl(ICanvasRegistryContent aContent) throws BaseException;

	/**
	 * This will be invoked for iterating through the registry content maintained by the registry.
	 * 
	 * @return Iterator for the content that is present in the registry
	 */
	protected abstract Iterator<ICanvasRegistryContent> registryIterator();

	/**
	 * This is the implementation of the ICanvasRegistry. Here we first provide the control to the sub class for adding
	 * it to the registry and if the same is successful, then the same will be raised to all interested listeners
	 * 
	 * @param aContent The content to the registered
	 * @return true, if the content got added to the registry. False otherwise
	 * @throws BaseException Thrown if any error occurs while added the content to the registry
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistry#register(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	public boolean register(ICanvasRegistryContent aContent) throws BaseException
	{
		boolean regSuccess = false;
		// Step 1: Check whether it is duplicate.
		ICanvasRegistryContent origContent = isContentDuplicate(aContent);
		if (origContent != null)
		{
			// Step 1.1: Check whether the content allows overriding.
			if (origContent.isOverrideAllowed())
			{
				// Step 1.2: Means we are going to do a replace. Trigger the event to see if anyone is interested in
				// negating the same.
				Iterator<ICanvasRegistryListener> listIterator = this.listenerList.iterator();
				boolean allowReplace = true;
				while (listIterator.hasNext())
					allowReplace = allowReplace && listIterator.next().contentReplacing(origContent, aContent);

				if (allowReplace)
				{
					// Step 1.3: So all listeners are happy and want the replace to happen. Ask the sub class to replace
					// the orig value with new value in its registry
					replaceContent(origContent, aContent);
					regSuccess = true;
				} else
				{
					// If allowReplace is false. then it means that this should not be added. So set the regSuccess =
					// false;
					regSuccess = false;
				}
			}
		} else
		{
			// Means that this is a new content. So proceed with adding the same
			// Step 2: Trigger the sub class to actual add the content
			regSuccess = registerImpl(aContent);

			// Step 3: Propagate the event
			if (regSuccess)
			{
				Iterator<ICanvasRegistryListener> listIterator = this.listenerList.iterator();
				while (listIterator.hasNext())
					listIterator.next().contentAdded(aContent);
			}
		}

		return regSuccess;
	}

	/**
	 * This is the implementation of the ICanvasRegistry. Here we first provide the control to the sub class for
	 * removing it from the registry and if the same is successful, then the same will be raised to all interested
	 * listeners
	 * 
	 * @param aContent The content to the removed
	 * @return true, if the content got added to the registry. False otherwise
	 * @throws BaseException Thrown if any error occurs while removing the content from the registry
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistry#register(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	public boolean unregister(ICanvasRegistryContent aContent) throws BaseException
	{
		boolean unregSuccess = unregisterImpl(aContent);

		if (unregSuccess)
		{
			Iterator<ICanvasRegistryListener> listIterator = this.listenerList.iterator();
			while (listIterator.hasNext())
				listIterator.next().contentRemoved(aContent);
		}

		return unregSuccess;
	}

	/**
	 * ref to the ICanvasRegistryContent lookup match
	 * 
	 * @param parametersList
	 * @return ICanvasRegistryContent
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistry#lookup(java.lang.Object[])
	 */
	@Override
	public ICanvasRegistryContent lookup(Object... parametersList) throws BaseException
	{
		return this.indexer.match(parametersList);
	}

	/**
	 * This method iterates through the registry content to identify whether the content provided is already present.
	 * 
	 * @param aContent The content to be checked for duplicate
	 * @return ICanvasRegistryContent The existing item in the registry if it is deemed duplicate of the content
	 *         provided. Else null
	 */
	private ICanvasRegistryContent isContentDuplicate(ICanvasRegistryContent aContent)
	{
		ICanvasRegistryContent duplicateEntry = null;
		ICanvasRegistryContent aRegContent = null;
		Iterator<ICanvasRegistryContent> regIterator = registryIterator();
		while (regIterator.hasNext())
		{
			aRegContent = regIterator.next();
			if (aRegContent.compareTo(aContent) == 0)
			{
				duplicateEntry = aRegContent;
				break;
			}
		}
		return duplicateEntry;
	}

}
