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

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * A Registry is a central point of storage of a similar set of objects that can be accessed from any where within the
 * application. In a typical situation, the registry will be a singleton, but that is more a recommendation rather than
 * a specification
 * 
 * The content to be stored in the registry has to implement the ICanvasRegistryContent interface
 * 
 * A registry uses the services of an Indexer for the purpose of retrieval of content. Without this a registry will not
 * be able to identify how to match the search criteria to its internal content.
 * 
 * @version 1.0
 */
public interface ICanvasRegistry
{
	/**
	 * This method will be invoked to add a new content to the registry
	 * 
	 * @param aContent The content to be added
	 * @return true, if the content was added successfully. False, if the content addition was revoked by any of the
	 *         listeners
	 * @exception BaseException Thrown if any error occurs while registering the content
	 */
	boolean register(ICanvasRegistryContent aContent) throws BaseException;

	/**
	 * This method will be invoked to add a new content to the registry from a source rather than as individual content
	 * entries. The path provided does not have to be a physical path always. The application will look to load the
	 * resource path from the classpath. In case this is not available then will try to load it as a File System
	 * resource.
	 * 
	 * @param contentSourcePath The Path to the file where the content can be loaded fron
	 * @exception BaseException Thrown if any error occurs while registering the content
	 */
	void register(String contentSourcePath) throws BaseException;

	/**
	 * This method will be invoked to remove a new content from the registry
	 * 
	 * @param aContent The content to be removed
	 * @return true, if the content was removed successfully. False, if the content is not present in registry
	 * @exception BaseException Thrown if any error occurs while registering the content
	 */
	boolean unregister(ICanvasRegistryContent aContent) throws BaseException;

	/**
	 * This method will be invoked to retrieve a content based on the dynamic list of parameters.
	 * 
	 * @param parametersList The list of parameters based on which the matching should be done
	 * @return the content identified for the provided parameters. null if no match was identified
	 * @exception BaseException Thrown if any error occurs while doing the lookup
	 */
	ICanvasRegistryContent lookup(Object... parametersList) throws BaseException;
}
