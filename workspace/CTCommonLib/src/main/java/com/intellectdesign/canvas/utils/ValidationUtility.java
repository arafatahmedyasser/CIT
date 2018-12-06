/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to intellectdesign Financial Technology 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
package com.intellectdesign.canvas.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author karthik.velayudham
 * @Version 1.0
 */
public class ValidationUtility
{
	public ValidationUtility(){}
	
	public boolean validateHexColor(String colorCode){
		Pattern pattern;
		Matcher matcher;
		final String HEX_PATTERN;
		if(colorCode.startsWith("#")){
			HEX_PATTERN = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
		}else{
			HEX_PATTERN = "([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
		}
		pattern = Pattern.compile(HEX_PATTERN);
		matcher = pattern.matcher(colorCode);
		return matcher.matches();
	}
	
	public boolean validWeekEnd(int weekend){
		List weekDaysList = new ArrayList();
		weekDaysList.add(0);
		weekDaysList.add(1);
		weekDaysList.add(2);
		weekDaysList.add(3);
		weekDaysList.add(4);
		weekDaysList.add(5);
		weekDaysList.add(6);
		if(weekDaysList.contains(weekend)){
			return true;
		}
		return false;
	}
}
