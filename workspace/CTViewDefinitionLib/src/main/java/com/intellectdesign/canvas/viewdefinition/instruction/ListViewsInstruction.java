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

package com.intellectdesign.canvas.viewdefinition.instruction;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.listviews.ListViewConstants;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.entitlement.EntitlementException;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.properties.reader.CTProperties;
import com.intellectdesign.canvas.viewdefinition.ColumnFilter;
import com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewManager;
import com.intellectdesign.canvas.viewdefinition.util.ListViewUtil;

/**
 * This is the base class for all list view instructions. This provides some default implementation for some of the
 * abstract methods of Simple View Definition Instruction.
 * 
 * @version 1.0
 */
public abstract class ListViewsInstruction extends SimpleViewDefinitionInstruction
{
	/**
	 * This method retrives the entitlement data of the user to access the data in the View 
	 * 
	 * @param viewDefinition - ViewDefinition object containing the view details
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client
	 * @return dataEntitlements - DataEntitlements object that contains the user entitlement detail
	 * 
	 * @throws ViewDefinitionException thrown if any error occurs while fetching account entitlement information for
	 *             this user.
	 */
	public DataEntitlements retrieveEntitlements(ViewDefinition viewDefinition, HashMap mapInputParams)
			throws ViewDefinitionException
	{
		DataEntitlements dataEntitlements = null;
		try
		{
			EntitlementsHelper entlHelper = new EntitlementsHelper();
			HashMap<String, Object> entlParams = getEntitlementParams(mapInputParams);
			String gcif = (String) mapInputParams.get(ListViewConstants.INPUT_GCIF);
			String userNo = (String) mapInputParams.get(ListViewConstants.INPUT_USER_NO);
			String sUserRole = (String) mapInputParams.get(ListViewConstants.INPUT_USER_ROLE);
			String sChannelId = (String) mapInputParams.get(ListViewConstants.INPUT_CHANNEL_ID);
			List<String> productsList = (ArrayList) entlParams.get(ListViewConstants.PRODUCT_LIST);
			List<String> subprodList = (ArrayList) entlParams.get(ListViewConstants.SUB_PRODUCT_LIST);
			List<String> functionList = (ArrayList) entlParams.get(ListViewConstants.FUNCTION_LIST);
			String[] prodArray = productsList.toArray(new String[productsList.size()]);
			String[] subprodArray = subprodList.toArray(new String[subprodList.size()]);
			String[] funcArray = functionList.toArray(new String[functionList.size()]);
			mapInputParams.putAll(entlParams);
			// Invoke the entitlements source to fetch the entitlements
			dataEntitlements = entlHelper.getUserDataEntitlements(prodArray, subprodArray, funcArray, gcif, userNo,
					sChannelId, sUserRole);
		} catch (EntitlementException e)
		{
			throw new ViewDefinitionException(e);
		}
		return dataEntitlements;
	}

	/**
	 * This method provides the hashmap of entitlement parameters User No, GCIF
	 * such as Product, Sub Product, Function Code and the Channel Id obtained from the client side
	 * cached parameters for the current View Id and Widget Id
	 * 
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client  
	 * @return EntitlementParams - Hashmap of the entitlement paramters for the View Id and Widget Id
	 * @throws ViewDefinitionException
	 */
	private HashMap<String, Object> getEntitlementParams(HashMap mapInputParams) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00268");
		LOGGER.ctdebug("CTVDF00269", mapInputParams);
		ViewManager manager = null;
		ViewDefinition definition = null;
		HashMap<String, Object> mInputParams = null;
		String viewId = null;
		String widgetId = null;
		try
		{
			mInputParams = new HashMap<String, Object>();
			manager = new ViewManager();
			definition = new ViewDefinition();

			viewId = (String) mapInputParams.get(ListViewConstants.VIEW_ID);
			/**
			 * In Case of loading Looup Filter applied widget, the request params does noiew.t have view id. So with the
			 * help of widget id retrieve the view id from the configuration and get the view definition object of the v
			 */
			if (viewId == null)
			{
				widgetId = (String) mapInputParams.get(ListViewConstants.WIDGET_ID);
				viewId = manager.getViewIdForWidget(widgetId);
			}
			/**
			 * Getting the view definition meta data for the particular view id.
			 */
			definition = manager.getViewDefinition(viewId);
			/**
			 * Adding the INPUT_PRODUCT as PRODUCT_LIST list and the list values will be getting from the
			 * getSubProductList method.
			 */
			mInputParams.put(ListViewConstants.PRODUCT_LIST, getProductCode(definition, mapInputParams));
			/**
			 * Adding the INPUT_SUB_PRODUCT as SUB_PRODUCT_LIST list and the list values will be getting from the
			 * getSubProductList method.
			 */
			mInputParams.put(ListViewConstants.SUB_PRODUCT_LIST, getSubProductCode(definition, mapInputParams));

			/**
			 * Adding the INPUT_FUNCTION_CODE as FUNCTION_LIST list and the list values will be getting from the
			 * getFunctionList method.
			 */
			mInputParams.put(ListViewConstants.FUNCTION_LIST, getFunctionCode(definition, mapInputParams));
		} catch (ViewDefinitionException viewDefException)
		{
			LOGGER.cterror("CTVDF00272", viewDefException);
			throw viewDefException;
		}
		LOGGER.ctdebug("CTVDF00270", mInputParams);
		LOGGER.ctinfo("CTVDF00271");
		return mInputParams;
	}

	/**
	 * This method gets the product code as list. 
	 * The sub class can override this method to give their product codes.
	 * 
	 * @param definition - ViewDefinition object containing the view details
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 
	 * 
	 * @return productList - List object containing the entitled product code of the View 
	 */
	protected List<String> getProductCode(ViewDefinition definition, HashMap mapInputParams)
	{
		LOGGER.ctinfo("CTVDF00273");
		List<String> productList = new ArrayList<String>();
		/**
		 * Getting the product code from the view meta data and adding this value to the list.
		 */
		productList.add(definition.getProduct());

		LOGGER.ctinfo("CTVDF00274");
		return productList;
	}

	/**
	 * This method gets the Sub Product code as list. 
	 * The sub class can override this method to give their Sub product codes.
	 * 
	 * @param definition - ViewDefinition object containing the view details
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 	
	 * @return subProductList - List object containing the entitled sub product code of the View 
	 */
	protected List<String> getSubProductCode(ViewDefinition definition, HashMap mapInputParams)
	{
		LOGGER.ctinfo("CTVDF00275");
		List<String> subProductList = new ArrayList<String>();
		/**
		 * Getting the sub product code from the view meta data and adding this value to the list.
		 */
		subProductList.add(definition.getSubProduct());

		LOGGER.ctinfo("CTVDF00276");
		return subProductList;
	}

	/**
	 * This method gets the function code as list. 
	 * The sub class can override this method to give their function codes.
	 * 
	 * @param definition - ViewDefinition object containing the view details
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 
	 * 
	 * @return functionList - List object containing the entitled function code of the View 
	 */
	protected List<String> getFunctionCode(ViewDefinition definition, HashMap mapInputParams)
	{
		LOGGER.ctinfo("CTVDF00277");
		List<String> functionList = new ArrayList<String>();
		/**
		 * Getting the function code from the view meta data and adding this value to the list.
		 */
		if (!definition.getFunctionCode().isEmpty())
		{
			functionList.add(definition.getFunctionCode());
		} else
		{

			functionList.add((String) mapInputParams.get(ListViewConstants.INPUT_FUNCTION_CODE));
		}

		LOGGER.ctinfo("CTVDF00278");
		return functionList;
	}

	/**
	 * This method forms the runtime filters from the input params
	 * 
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client
	 * @param viewDefinition - ViewDefinition object containing the view details
	 * @return listColumnFilters - List object containing all the runtime filters for this view.
	 */
	public ArrayList getRuntimeFilters(HashMap mapInputParams, ViewDefinition viewDefinition)
	{
		ArrayList listColumnFilters = null;
		String colCount = null;
		String colValue = null;
		String aColName = null;
		String sConstraint = null;
		int columnCount = 0;

		LOGGER.ctinfo("CTVDF00279");
		try
		{
			if (ViewDefinitionConstants.VAL_BOOL_TRUE.equals(mapInputParams
					.get(ViewDefinitionConstants.KEY_IS_FILTER_FORM)))
			{
				colCount = (String) mapInputParams.get("COLUMN_COUNT");
				columnCount = Integer.parseInt(colCount);
				listColumnFilters = new ArrayList();
				for (int index = 1; index <= columnCount; index++)
				{
					colValue = String.valueOf(index);
					aColName = (String) mapInputParams.get("FILTER" + colValue + "_FIELD");
					if (viewUtils.isRateField(viewDefinition.getViewId(), aColName))
					{
						handleRateFilter(mapInputParams, listColumnFilters, colValue);
					}

					/**
					 * To check whether its Amount as amount columns will end with _AMT so that the filter field type
					 * need to set AMT
					 */
					else if (viewUtils.isNumberField(viewDefinition.getViewId(), aColName))
					{
						handleNumberFilter(mapInputParams, listColumnFilters, colValue);
					}
					/**
					 * To check whether its Date as date columns will end with _DT so that the filter field type need to
					 * set DT
					 */
					else if (viewUtils.isDateField(viewDefinition.getViewId(), aColName))
					{
						handleDateFilter(mapInputParams, listColumnFilters, colValue);
					}
					/**
					 * To check whether its Date as date columns will end with _DT so that the filter field type need to
					 * set TI
					 */
					else if (viewUtils.isTimeField(viewDefinition.getViewId(), aColName))
					{
						LOGGER.ctinfo("CTVDF00280");
						//handleTimeFilter(mapInputParams, listColumnFilters, colValue);
						handleDateFilter(mapInputParams, listColumnFilters, colValue); //Currently only date filter being applied
						LOGGER.ctinfo("CTVDF00281");
					} else
					{
						handleStringFilter(mapInputParams, listColumnFilters, colValue);
					}
				}
			}

			if (ViewDefinitionConstants.VAL_BOOL_TRUE.equals(mapInputParams
					.get(ViewDefinitionConstants.IS_DATE_FILTER_FORM)))
			{

				if (listColumnFilters == null)
					listColumnFilters = new ArrayList();

				colValue = (String) mapInputParams.get(ViewDefinitionConstants.COLUMN_VALUE);

				handleDateFilter(mapInputParams, listColumnFilters, colValue);

			}
		} catch (ProcessingErrorException ex)
		{
			LOGGER.cterror("CTVDF00282", ex);
		} catch (Exception e)
		{
			LOGGER.cterror("CTVDF00283", e);
		}

		LOGGER.ctdebug("CTVDF00284", listColumnFilters);
		LOGGER.ctinfo("CTVDF00285");
		return listColumnFilters;
	}

	/**
	 * This method is provided as a hook to change the filters before making the db request
	 * 
	 * @param dbRequest - DatabaseRequest object containg the database request to fetch data
	 * @param runtimeFilters - ArrayList object containing all the runtime filters
	 * @param inputParams - Cached Hashmap of Input Parameters from the client 
	 * 
	 * @see com.intellectdesign.cib.viewdefinition.IViewInstruction#alterFilters(com.intellectdesign.canvas.constants.database.DatabaseRequest,
	 *      java.util.ArrayList, java.util.HashMap)
	 */
	public void alterFilters(DatabaseRequest dbRequest, ArrayList runtimeFilters, HashMap inputParams)
			throws ViewDefinitionException
	{
		// Default implementation. Nothing to be done here.
	}

	/**
	 * This is a helper method that handles the filtering of the float data type columns
	 * 
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 
	 * @param listColumnFilters - ArrayList of column filters 
	 * @param colValue - String value of the view column name for filtering
	 */
	protected void handleNumberFilter(HashMap mapInputParams, ArrayList<ColumnFilter> listColumnFilters, String colValue)
	{
		ColumnFilter aFilter;
		String aColName = "FILTER" + colValue + "_FIELD";
		String constraintKey = "FILTER" + colValue + "_CONSTRAINT";
		String filterValuesKey = "FILTER" + colValue + "_VALUE_TXT";
		String colId = (String) mapInputParams.get(aColName);

		if (!"".equals(colId.trim()))
		{
			aFilter = new ColumnFilter();
			ArrayList<Float> filterList = new ArrayList<Float>();
			Float filterVal = new Float((String) mapInputParams.get(filterValuesKey));
			filterList.add(filterVal);
			aFilter.setDataType(ViewDefinitionConstants.DATA_TYPE_NUMBER);
			// aFilter.setStrFilterValues((String) mapInputParams.get(filterValuesKey));
			aFilter.setFilterValues(filterList);
			aFilter.setFilterType((String) mapInputParams.get(constraintKey));
			aFilter.setColumnID(colId);
			LOGGER.ctinfo("CTVDF00286", aFilter);
			listColumnFilters.add(aFilter);
		}
	}

	/**
	 * This is a helper method that handles the filtering of the rate data type columns
	 * 
	 * @param mapInputParams- Cached Hashmap of Input Parameters from the client 
	 * @param listColumnFilters - ArrayList of column filters 
	 * @param colValue - String value of the view column name for filtering
	 */
	protected void handleRateFilter(HashMap<String, Object> mapInputParams, ArrayList<ColumnFilter> listColumnFilters,
			String colValue) throws ProcessingErrorException
	{
		LOGGER.ctinfo("CTVDF00287");
		ColumnFilter aFilter;
		String aColName = "FILTER" + colValue + "_FIELD";
		String constraintKey = "FILTER" + colValue + "_CONSTRAINT";
		String dataType = null;
		try
		{
			ArrayList<BigDecimal> filterList = new ArrayList<BigDecimal>();
			BigDecimal filterVal = new BigDecimal((String) mapInputParams.get("FILTER1_VALUE_TXT"));
			LOGGER.ctdebug("CTVDF00288");

			String strFilterVal = filterVal.toString();
			String arrFilterVal[] = strFilterVal.split("\\.");
			String colId = (String) mapInputParams.get(aColName);
			String constraint = (String) mapInputParams.get(constraintKey);
			LOGGER.ctdebug("CTVDF00289", colId, constraint);

			if (arrFilterVal.length > 1 && arrFilterVal[1].length() >= Integer.parseInt(strMaxRatePrecision))
			{
				LOGGER.ctdebug("CTVDF00290");
				BigDecimal upperLimitFilterVal = getUpperLimitValue(filterVal, constraint, arrFilterVal[1].length());
				filterList.add(upperLimitFilterVal);
				if ("=".equals(constraint))
				{
					BigDecimal lowerLimitFilterVal = getLowerLimitValue(filterVal, constraint, arrFilterVal[1].length());
					filterList.add(lowerLimitFilterVal);
				}
				dataType = ViewDefinitionConstants.DATA_TYPE_RATE;

			} else
			{
				// Changing the data type to float so that normal float type
				// filter query
				// if formed is the precision value is less than 7.
				filterList.add(filterVal);
				dataType = ViewDefinitionConstants.COLUMN_TYPE_AMOUNT;
			}
			if (!"".equals(colId.trim()))
			{
				aFilter = new ColumnFilter();
				aFilter.setDataType(dataType);
				aFilter.setFilterValues(filterList);
				aFilter.setFilterType(constraint);
				aFilter.setColumnID(colId);
				LOGGER.ctinfo("CTVDF00291", aFilter);
				listColumnFilters.add(aFilter);
			}
		} catch (ProcessingErrorException ex)
		{
			LOGGER.cterror("CTVDF00292", ex);
			throw ex;
		} catch (Exception e)
		{
			LOGGER.cterror("CTVDF00293", e);
			throw new ProcessingErrorException(e);
		}
		LOGGER.ctinfo("CTVDF00294");
	}

	/**
	 * This method provides the upper Limit Value for filtering records from the rate data type columns 
	 * 
	 * @param filterVal - BigDecimal value of the filter value
	 * @param constraint - String value of the condition used for filtering
	 * @param precisionLen - Integer value of the decimal precision length
	 * @return upperlimit - BigDecimal value of the upper limit
	 */
	private BigDecimal getUpperLimitValue(BigDecimal filterVal, String constraint, int precisionLen)
	{
		LOGGER.ctinfo("CTVDF00295");
		LOGGER.ctdebug("CTVDF00296", constraint);
		BigDecimal upperLimitFrac = null;
		BigDecimal finalUpperLimitVal = null;

		float updatedPrecLen = precisionLen + 1;
		Double baseRationalVal = (double) (new Double(1) / new Double(10));
		MathContext mc = new MathContext(precisionLen + 2, RoundingMode.HALF_EVEN);

		if ("=".equals(constraint) || "<".equals(constraint))
		{
			upperLimitFrac = new BigDecimal(Math.pow(baseRationalVal, updatedPrecLen) * 5);
			finalUpperLimitVal = filterVal.subtract(upperLimitFrac, mc);
		} else if (">".equals(constraint))
		{
			upperLimitFrac = new BigDecimal(Math.pow(baseRationalVal, updatedPrecLen) * 4);
			finalUpperLimitVal = filterVal.add(upperLimitFrac, mc);
		}

		LOGGER.ctdebug("CTVDF00297", finalUpperLimitVal);
		LOGGER.ctinfo("CTVDF00298");
		return finalUpperLimitVal;
	}

	/**
	 * This private helper method gets the lower limit values for the filter columns.
	 * 
	 * @param filterVal - BigDecimal value of the filter value
	 * @param constrain - String value of the "=" condition used for filtering
	 * @param precisionLen - Integer value of the decimal precision length
	 * @return LowerLimitValue - BigDecimal value of the lower limit
	 * 
	 * @throws ProcessingErrorException
	 */
	private BigDecimal getLowerLimitValue(BigDecimal filterVal, String constrain, int precisionLen)
			throws ProcessingErrorException
	{
		LOGGER.ctinfo("CTVDF00299");
		LOGGER.ctdebug("CTVDF00300", constrain);
		BigDecimal upperLimitFrac = null;
		BigDecimal finalUpperLimitVal = null;

		float updatedPrecLen = precisionLen + 1;
		Double baseRationalVal = (double) (new Double(1) / new Double(10));
		MathContext mc = new MathContext(precisionLen + 2, RoundingMode.HALF_EVEN);

		if ("=".equals(constrain))
		{
			upperLimitFrac = new BigDecimal(Math.pow(baseRationalVal, updatedPrecLen) * 4);

			finalUpperLimitVal = filterVal.add(upperLimitFrac, mc);
		}
		LOGGER.ctdebug("CTVDF00301", finalUpperLimitVal);
		LOGGER.ctinfo("CTVDF00302");
		return finalUpperLimitVal;
	}

	/**
	 * This is a helper method that handles the filtering of the string data type columns  
	 * 
	 * 
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 
	 * @param listColumnFilters - ArrayList of column filters 
	 * @param colValue - String value of the view column name for filtering
	 */
	protected void handleStringFilter(HashMap mapInputParams, ArrayList<ColumnFilter> listColumnFilters, String colValue)
	{
		ColumnFilter aFilter;
		String aColName = "FILTER" + colValue + "_FIELD";
		String constraintKey = "FILTER" + colValue + "_CONSTRAINT";
		String filterValuesKey = "FILTER" + colValue + "_VALUE_TXT";
		String filterValuesKey1 = "FILTER" + colValue + "_VALUE_COMBO";
		String valueTxt = (String) mapInputParams.get(filterValuesKey);
		String colId = (String) mapInputParams.get(aColName);
		if ("".equals(valueTxt.trim()))
		{
			valueTxt = (String) mapInputParams.get(filterValuesKey1);

			if (valueTxt != null)
			{
				valueTxt = valueTxt.trim();
			}

		}
		if (!"".equals(valueTxt))
		{
			aFilter = new ColumnFilter();
			aFilter.setDataType(ViewDefinitionConstants.DATA_TYPE_STRING);
			aFilter.setStrFilterValues(valueTxt);
			aFilter.setFilterType((String) mapInputParams.get(constraintKey));
			aFilter.setColumnID(colId);
			LOGGER.ctinfo("CTVDF00303", aFilter);
			listColumnFilters.add(aFilter);
		}
	}

	/**
	 * This method provides a flag that decides whether to validate 
	 * the current date used as filter is a business date or not
	 * 
	 * @return true - business date validation required / false - validation not required
	 */
	public boolean isValidBussinessDate()
	{

		String VALIDATION_REQUIRED = CTProperties.getProperty("CURRENT_BUSSINESS_DATE");
		if (VALIDATION_REQUIRED.equals("Y"))
		{
			return true;
		} else
		{
			return false;
		}
	}

	/**
	 * This is a helper method that handles the filtering of the date data type columns
	 * 
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client  
	 * @param listColumnFilters - ArrayList of column filters 
	 * @param colValue - String value of the view column name for filtering
	 */
	protected void handleDateFilter(HashMap mapInputParams, ArrayList<ColumnFilter> listColumnFilters, String colValue)
	{
		LOGGER.ctinfo("CTVDF00267");
		ColumnFilter aFilter = new ColumnFilter();
		int period = 0;
		String aColName = "FILTER" + colValue + "_FIELD";
		String valueDateKey = "FILTER" + colValue + "_VALUE_DATE";
		String valueDate2Key = "FILTER" + colValue + "_VALUE_DATE2";
		String constraintKey = "FILTER" + colValue + "_CONSTRAINT";

		String valuePeriodKey = "FILTER" + colValue + "_VALUE_PERIOD";
		String valueDate = (String) mapInputParams.get(valueDateKey);

		String colId = (String) mapInputParams.get(aColName);
		String valuePeriod = (String) mapInputParams.get(valuePeriodKey);
		String valueDate2 = mapInputParams.containsKey(valueDate2Key) ? (String) mapInputParams.get(valueDate2Key) : "";
		String filterType = (String) mapInputParams.get(constraintKey);
		String userPreferenceDateFormat = (String) mapInputParams
				.get(ViewDefinitionConstants.USER_PREFEERENCE_DATE_FORMAT);
		boolean validation;

		/**
		 * Following code snippet is to add previous and current month filter request This would mean to calculate the
		 * appropriate dates and then pass them as range for quering to DAO
		 */
		LOGGER.ctinfo("CTVDF00304", filterType);
		if (filterType.equals(ViewDefinitionConstants.OP_DT_CURR_DAY))
		{

			validation = isValidBussinessDate();
			if (validation == true)
			{
				String enqType = "NA";
				HashMap valueDateMap = null; // Retrieve the current bussinessdate from external API

				// Commented the code
				valueDate = (String) valueDateMap.get("INPUT_VALUE_DATE");
				valueDate2 = (String) valueDateMap.get("INPUT_VALUE_DATE");
				SimpleDateFormat sdf = new SimpleDateFormat("dd/mm/yyyy");

				valueDate = DateFormatterManager.convertDateTo(valueDate, "dd/mm/yyyy", "dd-mm-yyyy");
				valueDate2 = valueDate;
				filterType = ViewDefinitionConstants.OP_DT_RANGE;
			} else
			{
				Calendar cal = Calendar.getInstance();
				SimpleDateFormat sdf = new SimpleDateFormat(ViewDefinitionConstants.DATE_FORMAT);
				valueDate = sdf.format(cal.getTime());
				valueDate2 = sdf.format(cal.getTime());
				filterType = ViewDefinitionConstants.OP_DT_RANGE;
			}

		}

		else if (filterType.equals(ViewDefinitionConstants.OP_DT_PRE_DAY))
		{
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DATE, -1);
			SimpleDateFormat sdf = new SimpleDateFormat(ViewDefinitionConstants.DATE_FORMAT);
			valueDate = sdf.format(cal.getTime());
			valueDate2 = sdf.format(cal.getTime());
			filterType = ViewDefinitionConstants.OP_DT_RANGE;
		} else if (filterType.equals(ViewDefinitionConstants.OP_DT_LAST_N_DAY))
		{
			LOGGER.ctinfo("CTVDF00305", filterType);

			if (valuePeriod != "" && valuePeriod != null)
			{
				period = Integer.parseInt(valuePeriod);
			}

			Calendar cal = Calendar.getInstance();
			SimpleDateFormat sdf = new SimpleDateFormat(ViewDefinitionConstants.DATE_FORMAT);
			valueDate2 = sdf.format(cal.getTime());
			cal.add(Calendar.DATE, -period);

			valueDate = sdf.format(cal.getTime());
			filterType = ViewDefinitionConstants.OP_DT_RANGE;
		}

		else if (filterType.equals(ViewDefinitionConstants.OP_DT_CURR_MONTH))
		{
			Calendar cal = Calendar.getInstance();
			SimpleDateFormat sdf = new SimpleDateFormat(ViewDefinitionConstants.DATE_FORMAT);
			valueDate2 = sdf.format(cal.getTime());
			cal.set(Calendar.DATE, 1);
			valueDate = sdf.format(cal.getTime());
			filterType = ViewDefinitionConstants.OP_DT_RANGE;
		}

		else if (filterType.equals(ViewDefinitionConstants.OP_DT_LAST_N_MONTH))
		{
			LOGGER.ctinfo("CTVDF00306", filterType);
			if (valuePeriod != "" && valuePeriod != null)
			{
				period = Integer.parseInt(valuePeriod);
			}
			Calendar cal = Calendar.getInstance();
			SimpleDateFormat sdf = new SimpleDateFormat(ViewDefinitionConstants.DATE_FORMAT);
			cal.add(Calendar.MONTH, -1);
			cal.set(Calendar.DATE, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
			valueDate2 = sdf.format(cal.getTime());
			cal.add(Calendar.MONTH, -period+1);
			cal.set(Calendar.DATE, 1);
			valueDate = sdf.format(cal.getTime());
			filterType = ViewDefinitionConstants.OP_DT_RANGE;

		}

		else if (filterType.equals(ViewDefinitionConstants.OP_DT_PRE_MONTH))
		{
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.MONTH, -1);
			SimpleDateFormat sdf = new SimpleDateFormat(ViewDefinitionConstants.DATE_FORMAT);
			cal.set(Calendar.DATE, 1);
			valueDate = sdf.format(cal.getTime());
			cal.set(Calendar.DATE, cal.getActualMaximum(Calendar.DATE));
			valueDate2 = sdf.format(cal.getTime());
			filterType = ViewDefinitionConstants.OP_DT_RANGE;
		} else if (filterType == "")
		{
			filterType = ViewDefinitionConstants.OP_DT_RANGE;
		}

		aFilter.setDataType(ViewDefinitionConstants.DATA_TYPE_DATE);
		ArrayList listFilterValues = new ArrayList();

		if (!"".equals(mapInputParams.get(valueDateKey)) || !"".equals(mapInputParams.get(valuePeriod)))
		{
			listFilterValues.add(valueDate);
			if (!ViewDefinitionConstants.VAL_SELECT.equalsIgnoreCase(valueDate2.trim()))
			{
				if (!"".equals(valueDate2))
					listFilterValues.add(valueDate2);
			}
			aFilter.setFilterValues(listFilterValues);

			aFilter.setFilterType(filterType);
			aFilter.setColumnID(colId);
			LOGGER.ctinfo("CTVDF00307", aFilter);
			listColumnFilters.add(aFilter);
		}
		/**
		 * If user selected range and only selected To Date then dates less than the selected dates need to be displayed
		 */
		else if ("".equals(valueDate) && ViewDefinitionConstants.LT_EQUALS.equals(mapInputParams.get(constraintKey)))
		{
			if (!"".equals(valueDate2))
			{
				listFilterValues.add(valueDate2);
			}
			aFilter.setFilterValues(listFilterValues);
			aFilter.setFilterType(filterType);
			aFilter.setColumnID(colId);
			LOGGER.ctinfo("CTVDF00307", aFilter);
			listColumnFilters.add(aFilter);
		}
	}

	/**
	 * This is a helper method that handles the filtering of the time data type columns
	 * 
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 
	 * @param listColumnFilters - ArrayList of column filters 
	 * @param colValue - String value of the view column name for filtering
	 */
	protected void handleTimeFilter(HashMap mapInputParams, ArrayList<ColumnFilter> listColumnFilters, String colValue)
	{
		ColumnFilter aFilter = new ColumnFilter();
		String aColName = "FILTER" + colValue + "_FIELD";
		String valueTimeKey = "FILTER" + colValue + "_VALUE_TIME";
		String valueTime2Key = "FILTER" + colValue + "_VALUE_TIME2";
		String constraintKey = "FILTER" + colValue + "_CONSTRAINT";
		String colId = (String) mapInputParams.get(aColName);
		String valueTime = (String) mapInputParams.get(valueTimeKey);
		String valueTime2 = mapInputParams.containsKey(valueTime2Key) ? (String) mapInputParams.get(valueTime2Key) : "";
		String filterType = (String) mapInputParams.get(constraintKey);
		aFilter.setDataType(ViewDefinitionConstants.DATA_TYPE_TIMESTAMP);
		ArrayList listFilterValues = new ArrayList();
		if (!"".equals(mapInputParams.get(valueTimeKey)))
		{
			listFilterValues.add(valueTime);
			if (valueTime2 != null && !ViewDefinitionConstants.VAL_SELECT.equalsIgnoreCase(valueTime2.trim()))
			{
				if (!"".equals(valueTime2))
					listFilterValues.add(valueTime2);
			}
			aFilter.setFilterValues(listFilterValues);

			aFilter.setFilterType(filterType);
			aFilter.setColumnID(colId);
			LOGGER.ctinfo("CTVDF00307", aFilter);
			listColumnFilters.add(aFilter);
		}
		/**
		 * If user selected range and only selected To Time then time less than the selected time need to be displayed
		 */
		else if ("".equals(valueTime) && ViewDefinitionConstants.LT_EQUALS.equals(mapInputParams.get(constraintKey)))
		{
			if (!"".equals(valueTime2))
			{
				listFilterValues.add(valueTime2);
			}
			aFilter.setFilterValues(listFilterValues);
			aFilter.setFilterType(filterType);
			aFilter.setColumnID(colId);
			LOGGER.ctinfo("CTVDF00307", aFilter);
			listColumnFilters.add(aFilter);
		}
	}

	/**
	 * This method should return true to indicate the client side filter to allow the user to change the sort
	 * direction dynamically. The sub class can override this method to restrict client side sorting
	 * 
	 * @return true - enables runtime sorting / false - restricts runtime sorting 
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#isRuntimeSortingEnabled()
	 */
	@Override
	protected boolean isRuntimeSortingEnabled()
	{
		return true;
	}

	/**
	 * This method is intended to return currency code for amount conversion.
	 * 
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 
	 * @param viewDefinition - ViewDefinition object containing the view details
	 * @return Currencycode - String value of Currency Code from the client side or from the User Preference 
	 */
	protected String getAmountConversionCurrency(HashMap mapInputParams, ViewDefinition viewDefinition)
	{
		String equivalentCcy = (String) mapInputParams.get(ListViewConstants.FLD_CURRENCY_CD);
		if ((equivalentCcy == null) || ("".equals(equivalentCcy)))
		{
			equivalentCcy = (String) mapInputParams.get(ListViewConstants.FLD_USER_PREFERED_CURRENCY_CD);
		}
		return equivalentCcy;
	}

	/**
	 * This method is intended to return rate card id for amount conversion.
	 * 
	 * @param mapInputParams - Cached Hashmap of Input Parameters from the client 
	 * @param viewDefinition - ViewDefinition object containing the view details
	 * @return rateCard - User preferred Rate card id
	 */
	protected String getAmountConversionRateCard(HashMap mapInputParams, ViewDefinition viewDefinition)
	{
		String rateCard = (String) mapInputParams.get(ListViewConstants.FLD_USER_PREFERED_RATECARD);
		return rateCard;
	}

	private ListViewUtil viewUtils = new ListViewUtil();
	// An instance of Logger
	private Logger LOGGER = Logger.getLogger(ListViewsInstruction.class);
	private String strMaxRatePrecision = CTProperties.getProperty(FrameworkConstants.RATE_MAX_PRECISION);
}