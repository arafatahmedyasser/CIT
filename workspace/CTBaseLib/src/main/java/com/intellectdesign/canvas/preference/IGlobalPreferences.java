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
package com.intellectdesign.canvas.preference;

import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * This interface is for IGlobalPreferences
 * 
 * @version 1.0
 */
public interface IGlobalPreferences
{

	/**
	 * This is a utility class to get the default values to be used for a user's preference. The default values in a
	 * user's preference is been taken from orbionedirect properties file.
	 * 
	 * @return Map contains all the values in a user's default preference along with appropriate keys.
	 * @throws RemoteException
	 */
	public Map getDefaultUserPreferences() throws RemoteException;

	/**
	 * This is a utility class to get all the timezones from the TIMEZONEMASTER table
	 * 
	 * @return Map contains all the codes and GMT offsets of the timezones available in portal
	 * @throws RemoteException
	 */
	public Map getTimeZones() throws RemoteException;

	/**
	 * This will return the date format corresponding to the dateid. dateid will be used as the key in dateformat
	 * combobox and this is what we will get at server if we submit the preferences form. But the session will store
	 * dateformat as the format only, so before setting in session we need to get the corresponding format form the id.
	 * 
	 * @param dateid id set for thid format like D002
	 * @throws RemoteException
	 * @return formatted date
	 */
	public String getDateFormat(String dateid) throws RemoteException;

	/**
	 * The method will return date code for a given dateformat
	 * 
	 * @param dateformat
	 * @return date code like D002
	 * @throws RemoteException
	 */
	public String getDateCode(String dateformat) throws RemoteException;

	/**
	 * The method will return timezone offset for a given timezone code
	 * 
	 * @param timezone
	 * @return timezone offset in gmt
	 * @throws RemoteException
	 */
	public String getTimeZoneOffset(String timezone) throws RemoteException;

	/**
	 * The method will return timezone nick name for a given timezone code
	 * 
	 * @param timezone
	 * @return timezone nick name
	 * @throws RemoteException
	 */
	public String getTimeZoneNickName(String timezone) throws RemoteException;

	/**
	 * The method will return timezone offset for a given timezone code
	 * 
	 * @param timezone
	 * @param date
	 * @return timezone offset in gmt
	 * @throws RemoteException
	 */
	public String getTimeZoneOffset(String timezone, Date date) throws RemoteException;

	/**
	 * This Method will construct and return the offset value of Timezone ID.
	 * 
	 * @param timezoneID
	 * @param date
	 * @return offset
	 * @throws RemoteException
	 */

	public String convertToOffset(String timezoneID, Date date) throws RemoteException;

	/**
	 * This method is used to convert current date and time to user preferred time zone
	 * 
	 * @param userPreferedTimeZone
	 * @return formattedDateAndTime
	 * @throws RemoteException
	 */
	public String getConvertedTime(String userPreferedTimeZone) throws RemoteException;

	/**
	 * This method is used to convert date and time to user preferred time zone
	 * 
	 * @param userPreferedTimeZone
	 * @param date
	 * @return formattedDateAndTime
	 * @throws RemoteException
	 */
	public String getConvertedTime(String userPreferedTimeZone, Date date) throws RemoteException;

	/**
	 * This method is used to convert calendar into default format of date and time
	 * 
	 * @param cal
	 * @return Returns formatted date and time
	 * @throws RemoteException
	 */
	public String formatDateAndTime(Calendar cal) throws RemoteException;

	/**
	 * This method is used to convert Date and Time into User Preference format of date and time
	 * 
	 * @param user data format
	 * @param timeZoneId
	 * @param current date
	 * @return Returns User Preference format of date and time
	 * @throws RemoteException
	 */
	public String userPrefFormatDateAndTime(String formatDate, String timeZoneId, Date date) throws RemoteException;

	/**
	 * This method is used to convert Date into User Preference format of date
	 * 
	 * @param user data format
	 * @param timeZoneId
	 * @param current date
	 * @return Returns User Preference format of date
	 * @throws RemoteException
	 */

	public String userPrefFormatDate(String formatDate, String timeZoneId, Date date) throws RemoteException;

	/**
	 * This is a helper method that goes through the list of records available and formats the data present in the
	 * amount column name to the user preferred date format and adds the timezone id provided.
	 * 
	 * @param recordsList The list of records that needs the update
	 * @param dateColName The date column name
	 * 
	 * @param timeZoneId The user preferred time zone format.
	 * @param includeTimezone Flag indicating if timezone should be appended to the formatted date.
	 * @return The formatted date time.
	 * @throws RemoteException
	 */
	public void formatDateTime(ArrayList<HashMap> recordsList, String dateColName, String timeZoneId,
			boolean includeTimezone) throws RemoteException;

	/**
	 * This is a helper method that goes through the list of records available and formats the data present in the
	 * amount column name to the user preferred date format and adds the timezone id provided.
	 * 
	 * @param recordsList The list of records that needs the update
	 * @param dateColName The date column name
	 * @param ampmMarker the flag for am/pm marker
	 * @param timeZoneId The user preferred time zone format.
	 * @param toDateFormat To which format date needs to convert
	 * @return The formatted date time.
	 * @throws RemoteException
	 */
	public void formatDateTime(ArrayList<HashMap> recordsList, String dateColName, String timeZoneId,
			String toDateFormat, boolean ampmMarker) throws RemoteException;

	/**
	 * This is helper method which return the converted server timezone.
	 * 
	 * @param date
	 * @param sourceTimezone
	 * @param TargetTimeZone
	 * @throws RemoteException
	 * @return Returns the time in converted server timezone.
	 */
	public String getConvertedTimeInTargertTimezone(Date date, String sourceTimezone, String TargetTimeZone)
			throws RemoteException;

	/**
	 * This is a helper method that goes through the list of records available and formats the data present in the
	 * amount column name to the user preferred date format and adds the timezone id provided.
	 * 
	 * @param hashmap values that needs the update
	 * @param dateColName The date column name
	 * 
	 * @param timeZoneId The user preferred time zone format.
	 * @param includeTimezone Flag indicating if timezone should be appended to the formatted date.
	 * @return Returns the formatted date/time
	 * @throws RemoteException
	 */
	public void formatDateTime(HashMap hashmap, String dateColName, String timeZoneId, boolean includeTimezone)
			throws RemoteException;

	/**
	 * This is the helper Method which return the converted date/time
	 * 
	 * @param recordsList
	 * @param dateColName
	 * @param timeZoneId
	 * @param tideServerTimezone
	 * @throws RemoteException
	 */
	
	public void formatSourcetoDestTz(ArrayList<HashMap> recordsList, String dateColName, String timeZoneId,
			String tideServerTimezone) throws RemoteException;
	/**
	* This is the helper Method which return the converted date/time based on the user prefered format.
	*
	* @param formatDateTime
	* @param date
	* @return
	* @throws RemoteException
	*/
	public String formatUserPrefDateTime(String formatDateTime, String date) throws RemoteException;

	/**
	* This is the method gives the direction of given language.
	*
	* @param langId id. eg: en_US
	* @return Direction of the Language. eg: LTR for en_US
	*/
	public String getLangDirection(String langId)throws RemoteException;  

}
