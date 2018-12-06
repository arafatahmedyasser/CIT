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

package com.intellectdesign.canvas.config;

import com.intellectdesign.canvas.spec.ICanvasListener;

/**
 * This class contains the listeners for the configuration changes
 * 
 * @version 1.0
 */
public interface IConfigurationChangeListener extends ICanvasListener
{
	/**
	 * This event will be raised whenever the configuration has been initialized for the first time
	 */
	void configurationInitialized();

	/**
	 * This event will be raised whenever the configuration has been reinitialized / reloaded.
	 */
	void configurationReinitialized();

	/**
	 * This event will be raised whenever the application is being stopped / shutdown. Gives an option for the
	 * implementation classes to do a graceful cleanup
	 */
	void shutDown();
}
