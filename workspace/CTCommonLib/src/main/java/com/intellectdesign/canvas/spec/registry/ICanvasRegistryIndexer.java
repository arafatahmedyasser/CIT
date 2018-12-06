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

/**
 * A registry indexer is an important part of the registry in that it helps in retrieval of a content from the registry.
 * Since the nature of content in the registry can be dynamic, it is necessary for a corresponding indexer to be created
 * that knows how to match and retrieve the appropriate content from registry.
 * 
 * For cases where the Indexer wants to do prior indexing of the content, it has to implement the
 * ICanvasRegistryListener interface for maintaining an updated state of the index for any changes done to the registry
 * 
 * @see ICanvasRegistryListener
 * @version 1.0
 */
public interface ICanvasRegistryIndexer extends ICanvasRegistryListener
{
	/**
	 * This method will be invoked with the appropriate arguments that are applicable for the target content. The number
	 * of arguments / type of arguments are applicable specific to the content being stored in registry
	 * 
	 * @param args The inputs for identifying a particular item from the registry
	 * @return The reference to the content from the registry. If the content is not present in registry, then this
	 *         returns null.
	 */
	ICanvasRegistryContent match(Object... args);

	/**
	 * This method will be invoked when a registry is being created and it creates the indexer passing a reference to
	 * its instance for the indexer to operate upon.
	 * 
	 * @param parentRegistry
	 */
	void setRegistry(ICanvasRegistry parentRegistry);
}
