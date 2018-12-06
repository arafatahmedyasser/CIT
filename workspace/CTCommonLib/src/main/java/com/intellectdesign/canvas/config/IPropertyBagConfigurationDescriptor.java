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

/**
 * This is an extended specification for creation of a Property bag Configuration Descriptor. This provides the default
 * support for retrieving values like reading from a Property bundle. The API signature is kept similar to Property
 * bundle (getString()) to make it easy for equivalent replacement across the system
 * 
 * @version 1.0
 */
public interface IPropertyBagConfigurationDescriptor extends IConfigurationDescriptor
{
	/**
	 * This returns the configured value for the given property key. In case the same has not been configured, this can
	 * return null
	 * 
	 * @param propKey The property key against which configured value is to be retrieved
	 * @return The value from configuration if present. Else returns null
	 */
	String getString(String propKey);

	/**
	 * This returns the configured value for the given property key. In case the same has not been configured, this will
	 * return the default value provided
	 * 
	 * @param propKey The property key against which configured value is to be retrieved
	 * @param defaultValue The default value to return if the configuration is missing. Note. a configuration present
	 *            with empty string will still be treated as a configuration present. Only if the key itself is not
	 *            present will the Canvas system treat it as a missing configuration
	 * @return The value from configuration if present. Else returns the default value
	 */
	String getString(String propKey, String defaultValue);
}
