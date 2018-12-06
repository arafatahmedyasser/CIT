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

import java.io.Serializable;

/**
 * This interface marks a Configuration descriptor. A Configuration descriptor is one that provides various bean like
 * properties, but also has a definite structure around the creation of the configuration.
 * 
 * @version 1.0
 */
public interface IConfigurationDescriptor extends Serializable
{
	/**
	 * Returns the name of this descriptor. This is as per the configuration provided to Canvas platform
	 * 
	 * @return The name of the descriptor
	 */
	String getName();

	/**
	 * This method will be triggered for a configuration descriptor to load the configuration
	 * 
	 * @param configSource The source of the configuration
	 * @param defaultDescriptor The default descriptor that is initialized
	 * @throws ConfigurationException Thrown if any error occurs while loading the configuration
	 */
	void loadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException;

	/**
	 * This method will be triggered for a configuration descriptor to reload the configuration
	 * 
	 * @param configSourceString The source of the configuration
	 * @param defaultDescriptor The default descriptor that is initialized
	 * @throws ConfigurationException Thrown if any error occurs while reloading the configuration
	 */
	void reloadConfiguration(String configSourceString, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException;
}
