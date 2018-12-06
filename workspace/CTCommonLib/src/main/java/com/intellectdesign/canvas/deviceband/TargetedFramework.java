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

package com.intellectdesign.canvas.deviceband;

/**
 * This enumeration has the various targeted framework that are supported by Canvas Platform
 * 
 * @version 1.0
 */
public enum TargetedFramework
{
	/**
	 * Represents the Ext Js Technology ( Currently targeted for the PC )
	 */
	EXT_JS("ext"),
	/**
	 * Represents the JQuery Mobile Technology ( Currently targeted for the Mobile,Tablets and Phablets )
	 */
	JQUERY_MOBILE("jqm"),
	/**
	 * Represents the JQuery Technology ( Currently targeted for the PC )
	 */
	JQUERY_UI("jqui"),
	
	/**
	 * Represents the JQuery BootStrap Technology ( Currently targeted for the PC )
	 */
	JQUERY_BOOTSTRAP("jqtbs");
	

	private String frameworkname;

	/**
	 * ref to TargetedFramework
	 * 
	 * @param framework
	 */
	private TargetedFramework(String framework)
	{
		this.frameworkname = framework;
	}

	/**
	 * ref to Str to values
	 * 
	 * @return frameworkname
	 * @see java.lang.Enum#toString()
	 */
	@Override
	public String toString()
	{
		return frameworkname;
	}
}
