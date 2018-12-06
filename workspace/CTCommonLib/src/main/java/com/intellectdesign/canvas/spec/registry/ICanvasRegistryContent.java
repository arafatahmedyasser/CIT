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

import java.io.Serializable;

/**
 * This interface is used to designate any object as ready for getting added into a Canvas Registry. Any content that
 * can be added to a registry should be serializable to ensure that the Registry has options for better management of
 * the content of the registry. A content implementation has to implement the Comparable interface. This is used by the
 * registry to identify duplicates at the time of addition into the registry
 * 
 * @version 1.0
 */
public interface ICanvasRegistryContent extends Serializable, Comparable
{
	/**
	 * Internal constant for serialization purposes
	 */
	/**
	 * Any content being added to the registry can indicate whether to can be overriden on not. If a content indicates
	 * that it cannot be overridden, then the registry will not allow the content to be replaced
	 * 
	 * @return Flag indicated if the content can be overridden with a newer version
	 */
	boolean isOverrideAllowed();
}
