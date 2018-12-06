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

import java.util.ArrayList;

/**
 * Contains arraylist list of details
 * 
 * @version 1.0
 */
public class DetailData
{
	private String reportTitle = null;
	private ArrayList detailsList = null;

	/**
	 * DetailData constructor with params
	 * 
	 * @param reportTitle
	 * @param detailsList
	 */

	public DetailData(String reportTitle, ArrayList detailsList)
	{
		this.reportTitle = reportTitle;
		this.detailsList = detailsList;
	}

	/**
	 * method that gets ReportTitle
	 * 
	 * @return Returns the ReportTitle
	 */

	public String getReportTitle()
	{
		return reportTitle;
	}

	/**
	 * method that gets DetailsList
	 * 
	 * @return Returns the DetailsList
	 */

	public ArrayList getDetailsList()
	{
		return detailsList;
	}

	/**
	 * String Representation of reportTitle and detailsList
	 * 
	 * @return String
	 */

	public String toString()
	{
		return reportTitle + " : " + detailsList;
	}

}