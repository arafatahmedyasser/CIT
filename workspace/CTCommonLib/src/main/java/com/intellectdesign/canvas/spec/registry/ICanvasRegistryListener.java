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
import com.intellectdesign.canvas.spec.ICanvasListener;

/**
 * This interface is to be implemented by classes that are interested in listening to events that may happen on a
 * registry. Key item to be noted by the implementation classes is that the registry is a global object within the
 * application domain. So the listeners also are expected to be global scope and not as use and throw objects
 * 
 * @version 1.0
 */
public interface ICanvasRegistryListener extends ICanvasListener
{
	/**
	 * This event will be raised by the registry after a new content has been added to the registry
	 * 
	 * @param aContent The content that has been added to the registry.
	 * @exception BaseException Should be thrown if any error occurs while handling the contentAdded event
	 */
	void contentAdded(ICanvasRegistryContent aContent) throws BaseException;

	/**
	 * This event will be raised by the registry after an existing content has been removed form the registry
	 * 
	 * @param aContent The content that has been removed from the registry
	 * @exception BaseException Should be thrown if any error occurs while handling the contentRemoved event
	 */
	void contentRemoved(ICanvasRegistryContent aContent) throws BaseException;

	/**
	 * This event will be raised by the registry when it detects a duplicate
	 * 
	 * @param oldContent The original content that was present in the registry
	 * @param newContent The new content that is trying to replace the same
	 * @return flag indicating whether the replace should be allowed or not. In case this returns false, the content
	 *         will not get replaced into the registry. If the return value is true, the content will get replaced in
	 *         the registry.
	 * @exception BaseException Should be thrown if any error occurs while handling the contentReplacing event
	 */
	boolean contentReplacing(ICanvasRegistryContent oldContent, ICanvasRegistryContent newContent) throws BaseException;
}
