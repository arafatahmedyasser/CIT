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

/**
 * IDateFormatter is an interface for Date formatting subclasses which 
 * formats date values as per target DateFormat manner. 
 *  
 * @Version 1.0
 */
public interface IDateFormatter
{
	/**
	 * This method helps to format Date value for the DateFormat provided.
	 * @param dateStr
	 * @param toformat
	 * @throws ParseException
	 */
	public String formatDate(String dateStr,String toformat) throws ParseException;
}
