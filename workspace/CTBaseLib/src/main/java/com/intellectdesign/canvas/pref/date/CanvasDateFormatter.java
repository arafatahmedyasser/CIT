/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.pref.date;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * CanvasDateFormatter is a defualt formatter class for formatting date values in a target DatetFormat manner. It allows
 * for parsing (text -> date) and then (date->text).
 * 
 * @Version 1.0
 */
public class CanvasDateFormatter implements IDateFormatter
{

	/**
	 * This method is used to format given value to target format.
	 * 
	 * @param dateStr The Date String
	 * @param toformat The Java Date Format
	 * @return formatted Datevalue
	 * @throws ParseException
	 * @see com.intellectdesign.canvas.pref.date.IDateFormatter#getFormattedDate(java.lang.String, java.lang.String)
	 */
	@Override
	public String formatDate(String dateStr, String toformat) throws ParseException
	{
		String returnDate = "";
		SimpleDateFormat simpFormat = null;
		Date date = null;
		simpFormat = new SimpleDateFormat("dd/MM/yyyy");
		date = simpFormat.parse(dateStr);
		simpFormat = new SimpleDateFormat(toformat);
		returnDate = simpFormat.format(date);
		return returnDate;
	}

}
