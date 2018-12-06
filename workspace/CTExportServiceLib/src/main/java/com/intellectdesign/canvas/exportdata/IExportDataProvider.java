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

package com.intellectdesign.canvas.exportdata;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * The interface models and encapsulates all processes and objects required for getting the data to be exported
 * 
 * @version 1.0
 */
public interface IExportDataProvider
{
	/**
	 * This method is used to get the ExportData
	 * 
	 * @param request
	 * @param actionMap
	 * @return Returns the IExportDataValueObject
	 */
	public IExportDataValueObject getExportData(HttpServletRequest request, ActionMap actionMap);
}
