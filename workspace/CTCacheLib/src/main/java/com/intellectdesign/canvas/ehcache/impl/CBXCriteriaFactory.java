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

package com.intellectdesign.canvas.ehcache.impl;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import net.sf.ehcache.search.Attribute;
import net.sf.ehcache.search.expression.Criteria;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This is the factory class used to instantiate the criteria objects based on the filters( Type and values ).
 * 
 * @version 1.0
 */
public final class CBXCriteriaFactory
{

	private static CBXCriteriaFactory criteriaFactory = new CBXCriteriaFactory();

	private static final String get = "get";

	/**
	 * An instance of Logger
	 */
	private static final Logger logger = Logger.getLogger(CBXCriteriaFactory.class);

	/**
	 * Private constructor to disable the developer to intantiate the class directly
	 */
	private CBXCriteriaFactory()
	{

	}

	/**
	 * Made the class as Singleton, So that it is intialized only once
	 * 
	 * @return this class refernce
	 */

	public static CBXCriteriaFactory getInstance()
	{
		return criteriaFactory;
	}

	/**
	 * <pre>
	 * The Method is used create the criteria object 
	 * according to the type and value of filters
	 * @param filterId
	 * These are the list of filters currently available as part of ViewDefintionFramework 
	 * dt_range 
	 * dt_gt 
	 * dt_gtequalto 
	 * str_starts_with
	 * str_ends_with 
	 * str_contains 
	 * str_in 
	 * dt_ltequalto 
	 * dt_notequalto 
	 * dt_equals
	 * dt_equals_sysdate 
	 * dt_lt_sysdate 
	 * dt_gt_sysdate 
	 * dt_ltequalto_sysdate
	 * dt_gtequalto_sysdate 
	 * dt_notequalto_sysdate 
	 * dt_lt 
	 * str_equals 
	 * num_equals
	 * num_lt 
	 * num_gt 
	 * num_ltequalto 
	 * num_gtequalto 
	 * num_notequalto 
	 * eqccy_equals
	 * eqccy_lt 
	 * eqccy_gt 
	 * eqccy_ltequalto 
	 * eqccy_gtequalto 
	 * eqccy_notequalto
	 * numstr_contains 
	 * previous_month 
	 * last_n_day 
	 * last_n_month
	 * @param filterValues
	 * @param attribute
	 * @return
	 * </pre>
	 */
	public Criteria createCriteria(String filterId, List<?> filterValues, Attribute<?> attribute)
	{
		Criteria retval = null;

		try
		{
			Class<?> paramTypes[] = new Class[2];
			paramTypes[0] = List.class;
			paramTypes[1] = Attribute.class;

			Object retobj;
			Method meth = CBXCriteriaFactory.class.getMethod(get + filterId.toLowerCase(), paramTypes);
			Object arglist[] = new Object[2];
			arglist[0] = filterValues;
			arglist[1] = attribute;
			retobj = meth.invoke(CBXCriteriaFactory.getInstance(), arglist);
			retval = (Criteria) retobj;

		} catch (NoSuchMethodException excep)
		{
			logger.cterror("CTCAC00022", excep, filterId);
		} catch (SecurityException excep)
		{
			logger.cterror("CTCAC00023", excep, filterId);
		} catch (InvocationTargetException excep)
		{
			logger.cterror("CTCAC00024", excep, filterId);
		} catch (IllegalAccessException excep)
		{
			logger.cterror("CTCAC00024", excep, filterId);
		} catch (Exception excep)
		{
			logger.cterror("CTCAC00025", excep, filterId);
		}

		return retval;
	}

	/**
	 * The Below method converts the string date filtervalue to date filter object
	 * 
	 * @throws ParseException
	 * @param filterDate
	 */

	private Date formatFilterDate(String filterDate) throws ParseException
	{

		java.text.DateFormat widgetDateFormatter = null;
		widgetDateFormatter = new java.text.SimpleDateFormat("dd/MM/yyyy");
		return widgetDateFormatter.parse(filterDate);
	}

	/**
	 * The Below method checks for the range of dates It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */

	public Criteria getdt_range(List<?> filterValues, Attribute attribute)
	{
		try
		{
			return attribute.between(formatFilterDate((String) filterValues.get(0)),
					formatFilterDate((String) filterValues.get(1)));
		} catch (ParseException e)
		{
			return null;
		}

	}

	/**
	 * The Below method checks for the date greater than the filtervalue It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_gt(List<?> filterValues, Attribute attribute)
	{
		try
		{
			return attribute.gt(formatFilterDate((String) filterValues.get(0)));
		} catch (ParseException e)
		{
			return null;
		}

	}

	/**
	 * The Below method checks for the date greater than and equal to the filtervalue It expects values to come in
	 * filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_gtequalto(List<?> filterValues, Attribute attribute)
	{
		try
		{
			return attribute.ge(formatFilterDate((String) filterValues.get(0)));
		} catch (ParseException e)
		{
			return null;
		}

	}

	/**
	 * The Below method checks for the filtervalue starts with. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getstr_starts_with(List<?> filterValues, Attribute attribute)
	{
		return attribute.ilike(filterValues.get(0) + "*");
	}

	/**
	 * The Below method checks for the filtervalue ends with It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getstr_ends_with(List<?> filterValues, Attribute attribute)
	{
		return attribute.ilike("*" + filterValues.get(0));
	}

	/**
	 * The Below method checks for the filtervalue contains. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getstr_contains(List<?> filterValues, Attribute attribute)
	{
		return attribute.ilike("*" + filterValues.get(0) + "*");
	}

	/**
	 * The Below method checks for the filtervalues contains. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getstr_in(List<?> filterValues, Attribute attribute)
	{
		return attribute.in(filterValues);
	}

	/**
	 * The Below method checks for date lesser than and equal to filtervalue. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_ltequalto(List<?> filterValues, Attribute attribute)
	{
		try
		{
			return attribute.le(formatFilterDate((String) filterValues.get(0)));
		} catch (ParseException e)
		{
			return null;
		}

	}

	/**
	 * The Below method checks for date not equal to filtervalue. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_notequalto(List<?> filterValues, Attribute attribute)
	{
		try
		{
			return attribute.ne(formatFilterDate((String) filterValues.get(0)));
		} catch (ParseException e)
		{
			return null;
		}

	}

	/**
	 * The Below method checks for date greater than and equal to filtervalue. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_equals(List<?> filterValues, Attribute attribute)
	{
		try
		{
			return attribute.eq(formatFilterDate((String) filterValues.get(0)));
		} catch (ParseException e)
		{
			return null;
		}

	}

	/**
	 * The Below method checks for date equal to sysdate. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_equals_sysdate(List<?> filterValues, Attribute attribute)
	{
		Calendar cal = Calendar.getInstance();
		return attribute.eq(cal.getTime());
	}

	/**
	 * The Below method checks for date lesser than sysdate. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_lt_sysdate(List<?> filterValues, Attribute attribute)
	{
		Calendar cal = Calendar.getInstance();
		return attribute.lt(cal.getTime());
	}

	/**
	 * The Below method checks for date greater than sysdate. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_gt_sysdate(List<?> filterValues, Attribute attribute)
	{
		Calendar cal = Calendar.getInstance();
		return attribute.gt(cal.getTime());
	}

	/**
	 * The Below method checks for date lesser than and equal to sysdate. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_ltequalto_sysdate(List<?> filterValues, Attribute attribute)
	{
		Calendar cal = Calendar.getInstance();
		return attribute.le(cal.getTime());
	}

	/**
	 * The Below method checks for date greater than and equal to sysdate. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_gtequalto_sysdate(List<?> filterValues, Attribute attribute)
	{
		Calendar cal = Calendar.getInstance();
		return attribute.ge(cal.getTime());
	}

	/**
	 * The Below method checks for date not equal to sysdate. It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_notequalto_sysdate(List<?> filterValues, Attribute attribute)
	{
		Calendar cal = Calendar.getInstance();
		return attribute.ne(cal.getTime());
	}

	/**
	 * The Below method checks for the date lesser than the filtervalue It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getdt_lt(List<?> filterValues, Attribute attribute)
	{
		try
		{
			return attribute.lt(formatFilterDate((String) filterValues.get(0)));
		} catch (ParseException e)
		{
			return null;
		}

	}

	/**
	 * The Below method checks for the string equal to filtervalue It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getstr_equals(List<?> filterValues, Attribute attribute)
	{
		return attribute.eq(filterValues.get(0));
	}

	/**
	 * The Below method checks for the number equal to filtervalue It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getnum_equals(List<?> filterValues, Attribute attribute)
	{
		return attribute.eq(filterValues.get(0));
	}

	/**
	 * The Below method checks for the number less than filtervalue It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getnum_lt(List<?> filterValues, Attribute attribute)
	{
		return attribute.lt(filterValues.get(0));
	}

	/**
	 * The Below method checks for the number greater than filtervalue It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getnum_gt(List<?> filterValues, Attribute attribute)
	{
		return attribute.gt(filterValues.get(0));
	}

	/**
	 * The Below method checks for the number lesser than and equal to filtervalue It expects values to come in
	 * filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getnum_ltequalto(List<?> filterValues, Attribute attribute)
	{
		return attribute.le(filterValues.get(0));
	}

	/**
	 * The Below method checks for the number greater than and equal to filtervalue It expects values to come in
	 * filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getnum_gtequalto(List<?> filterValues, Attribute attribute)
	{
		return attribute.ge(filterValues.get(0));
	}

	/**
	 * The Below method checks for the number not equal to filtervalue It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getnum_notequalto(List<?> filterValues, Attribute attribute)
	{
		return attribute.ne(filterValues.get(0));
	}

	/**
	 * The Below method checks for the currency equal to the filter value It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria geteqccy_equals(List<?> filterValues, Attribute attribute)
	{
		return attribute.eq(filterValues.get(0));
	}

	/**
	 * The Below method checks for the currency lesser than the filter value It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria geteqccy_lt(List<?> filterValues, Attribute attribute)
	{
		return attribute.lt(filterValues.get(0));
	}

	/**
	 * The Below method checks for the currency greater than the filter value It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria geteqccy_gt(List<?> filterValues, Attribute attribute)
	{
		return attribute.gt(filterValues.get(0));
	}

	/**
	 * The Below method checks for the currency lesser than and equal to the filter value It expects values to come in
	 * filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria geteqccy_ltequalto(List<?> filterValues, Attribute attribute)
	{
		return attribute.le(filterValues.get(0));
	}

	/**
	 * The Below method checks for the currency greater than and equal to the filter value It expects values to come in
	 * filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria geteqccy_gtequalto(List<?> filterValues, Attribute attribute)
	{
		return attribute.ge(filterValues.get(0));
	}

	/**
	 * The Below method checks for the currency not equal to the filter value It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria geteqccy_notequalto(List<?> filterValues, Attribute attribute)
	{
		return attribute.ne(filterValues.get(0));
	}

	/**
	 * The Below method checks for the number as string contains the filter value It expects values to come in
	 * filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getnumstr_contains(List<?> filterValues, Attribute attribute)
	{
		return attribute.ilike("*" + filterValues.get(0) + "*");
	}

	/**
	 * The Below method checks for the last month of the current month It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getprevious_month(List<?> filterValues, Attribute attribute)
	{
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.MONTH, -1);
		cal.set(Calendar.DATE, 1);
		Date valueDate = cal.getTime();
		cal.set(Calendar.DATE, cal.getActualMaximum(Calendar.DATE));
		Date valueDate2 = cal.getTime();

		return attribute.between(valueDate, valueDate2);
	}

	/**
	 * The Below method checks for the last n days from the current date It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getlast_n_day(List<?> filterValues, Attribute attribute)
	{
		String filterValue = (String) filterValues.get(0);
		int period = 0;

		if (filterValue != null)
		{
			period = Integer.parseInt(filterValue);
		}
		Calendar cal = Calendar.getInstance();
		Date valueDate = cal.getTime();
		cal.set(Calendar.DATE, -period);
		Date valueDate2 = cal.getTime();

		return attribute.between(valueDate, valueDate2);
	}

	/**
	 * The Below method checks for the last n months from the current month It expects values to come in filtervalues
	 * 
	 * @param filterValues
	 * @param attribute
	 * @return Critera
	 */
	public Criteria getlast_n_month(List<?> filterValues, Attribute attribute)
	{
		String filterValue = (String) filterValues.get(0);
		int period = 0;

		if (filterValue != null)
		{
			period = Integer.parseInt(filterValue);
		}
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.DATE, 1);

		Date valueDate = cal.getTime();
		cal.set(Calendar.MONTH, -period);
		Date valueDate2 = cal.getTime();

		return attribute.between(valueDate, valueDate2);
	}
}
