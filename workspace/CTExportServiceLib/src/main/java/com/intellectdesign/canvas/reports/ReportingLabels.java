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

package com.intellectdesign.canvas.reports;

import java.util.ResourceBundle;

import com.intellectdesign.canvas.logger.Logger;

/**
 * Contains labels from the reportingLabels resource bundle
 * 
 * @version 1.0
 */
public class ReportingLabels
{
	private static final Logger logger = Logger.getLogger(ReportingLabels.class);

	/**
	 * Method to get the ReportingLabel value from the resourcebundle for the key
	 * 
	 * @param code
	 * @return Returns the value for the code
	 * @throws Exception
	 */
	public static String getLabel(String code)
	{
		String cmName = "ReportingLabels:getLabel";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			ResourceBundle res = ResourceBundle.getBundle("reportinglabels");
			if (res != null)
			{
				return res.getString(code);
			}
			return code;
		} catch (Exception e)
		{
			logger.cterror("CTEXP00039", e);
			return code;
		}
	}
}
