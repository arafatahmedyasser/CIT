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

package com.intellectdesign.canvas.viewdefinition;

import java.io.Serializable;
import java.util.HashMap;

/**
 * This class is a VO that stores additional preferences data provided at a view level
 * 
 * @version 1.0
 */
public class ViewDefinitionPreferences implements Serializable, Cloneable
{
	/**
	 * Override the Object method implementation to return the proper clone of this object.
	 * 
	 * @see java.lang.Object#clone()
	 */
	public Object clone() throws CloneNotSupportedException
	{
		return super.clone();
	}

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -5523919947495032084L;

	/**
	 * The default constructor.
	 */
	public ViewDefinitionPreferences()
	{
		// Nothing to do here
	}

	/**
	 * To get all preferences in a map
	 * 
	 * @return HashMap of all preferences
	 */

	public HashMap getPreferenceAsMap()
	{
		HashMap retVal = new HashMap();
		retVal.put(ViewDefinitionConstants.FLD_PREF_RATECARD_IND, getRateCardAvailableInd());
		retVal.put(ViewDefinitionConstants.FLD_PREF_RATECARD_ID, getRateCardId());
		retVal.put(ViewDefinitionConstants.FLD_PREF_REF_CCY_AVBL_IND, getReferenceCcyAvailableInd());
		retVal.put(ViewDefinitionConstants.FLD_PREF_REF_CCY, getReferenceCcy());
		retVal.put(ViewDefinitionConstants.FLD_PREF_LAST_COL_HANDLING_IND, getLastColumnHandlingAvailableInd());
		retVal.put(ViewDefinitionConstants.FLD_PREF_LAST_COL_HANDLING, getLastColumnHandling());
		retVal.put(ViewDefinitionConstants.FLD_PREF_ACCT_GROUP_HANDLING_IND, getAcctGroupHandlingAvailableInd());
		retVal.put(ViewDefinitionConstants.FLD_PREF_ACCT_GROUP_HANDLING, getAcctGroupHandling());
		retVal.put(ViewDefinitionConstants.FLD_PREF_PERIOD, getPeriod());
		retVal.put(ViewDefinitionConstants.FLD_PREF_SUBPERIOD, getSubPeriod());
		retVal.put(ViewDefinitionConstants.FLD_PREF_PERIOD_IND, getPeriodInd());
		retVal.put(ViewDefinitionConstants.FLD_PREF_FROM_DATE, getFromDate());
		retVal.put(ViewDefinitionConstants.FLD_PREF_TO_DATE, getToDate());

		return retVal;
	}

	/**
	 * To get the viewId
	 * 
	 * @return the viewId
	 */
	public String getViewId()
	{
		return viewId;
	}

	/**
	 * To set the viewId
	 * 
	 * @param viewId the viewId to set
	 */
	public void setViewId(String viewId)
	{
		this.viewId = viewId;
	}

	/**
	 * To check RateCardAvailableInd
	 * 
	 * @return true if rate card is available for this view. Otherwise false
	 */
	public boolean isRateCardAvailableInd()
	{
		return ViewDefinitionConstants.VAL_BOOL_YES.equals(getRateCardAvailableInd());
	}

	/**
	 * To get the rateCardAvailableInd
	 * 
	 * @return the rateCardAvailableInd
	 */
	public String getRateCardAvailableInd()
	{
		return rateCardAvailableInd;
	}

	/**
	 * To set the rateCardAvailableInd
	 * 
	 * @param rateCardAvailableInd the rateCardAvailableInd to set
	 */
	public void setRateCardAvailableInd(String rateCardAvailableInd)
	{
		this.rateCardAvailableInd = rateCardAvailableInd;
	}

	/**
	 * To get the rateCardId
	 * 
	 * @return the rateCardId
	 */
	public String getRateCardId()
	{
		return rateCardId;
	}

	/**
	 * To set the rateCardId
	 * 
	 * @param rateCardId the rateCardId to set
	 */
	public void setRateCardId(String rateCardId)
	{
		this.rateCardId = rateCardId;
	}

	/**
	 * To check ReferenceCcyAvailableInd
	 * 
	 * @return true if ref ccy is available for this view. Otherwise false
	 */
	public boolean isReferenceCcyAvailableInd()
	{
		return ViewDefinitionConstants.VAL_BOOL_YES.equals(getReferenceCcyAvailableInd());
	}

	/**
	 * To get the referenceCcyAvailableInd
	 * 
	 * @return the referenceCcyAvailableInd
	 */
	public String getReferenceCcyAvailableInd()
	{
		return referenceCcyAvailableInd;
	}

	/**
	 * To set the referenceCcyAvailableInd
	 * 
	 * @param referenceCcyAvailableInd the referenceCcyAvailableInd to set
	 */
	public void setReferenceCcyAvailableInd(String referenceCcyAvailableInd)
	{
		this.referenceCcyAvailableInd = referenceCcyAvailableInd;
	}

	/**
	 * To get the referenceCcy
	 * 
	 * @return the referenceCcy
	 */
	public String getReferenceCcy()
	{
		return referenceCcy;
	}

	/**
	 * To set the referenceCcy
	 * 
	 * @param referenceCcy the referenceCcy to set
	 */
	public void setReferenceCcy(String referenceCcy)
	{
		this.referenceCcy = referenceCcy;
	}

	/**
	 * To check LastColumnHandlingAvailableInd
	 * 
	 * @return true if last column handling method is available for this view. Otherwise false
	 */
	public boolean isLastColumnHandlingAvailableInd()
	{
		return ViewDefinitionConstants.VAL_BOOL_YES.equals(getLastColumnHandlingAvailableInd());
	}

	/**
	 * To get the LastColumnHandlingAvailableInd
	 * 
	 * @return the lastColumnHandlingAvailableInd
	 */
	public String getLastColumnHandlingAvailableInd()
	{
		return lastColumnHandlingAvailableInd;
	}

	/**
	 * To set the lastColumnHandlingAvailableInd
	 * 
	 * @param lastColumnHandlingAvailableInd the lastColumnHandlingAvailableInd to set
	 */
	public void setLastColumnHandlingAvailableInd(String lastColumnHandlingAvailableInd)
	{
		this.lastColumnHandlingAvailableInd = lastColumnHandlingAvailableInd;
	}

	/**
	 * To get the LastColumnHandling
	 * 
	 * @return the lastColumnHandling
	 */
	public String getLastColumnHandling()
	{
		return lastColumnHandling;
	}

	/**
	 * To set the lastColumnHandling
	 * 
	 * @param lastColumnHandling the lastColumnHandling to set
	 */
	public void setLastColumnHandling(String lastColumnHandling)
	{
		this.lastColumnHandling = lastColumnHandling;
	}

	/**
	 * This method gets the flag whether the buckets corresponding to future date is inclusive or exclusive.
	 * 
	 * @return true, if future date is inclusive. false otherwise
	 */
	public boolean isFutureDateInclusive()
	{
		boolean retVal = false;
		if (isLastColumnHandlingAvailableInd())
		{
			retVal = ViewDefinitionConstants.LAST_COL_HANDLING_INCLUSIVE.equals(getLastColumnHandling());
		}
		return retVal;
	}

	/**
	 * 
	 * @return true if account group handling method is available for this view. Otherwise false
	 */
	public boolean isAcctGroupHandlingAvailableInd()
	{
		return ViewDefinitionConstants.VAL_BOOL_YES.equals(getAcctGroupHandlingAvailableInd());
	}

	/**
	 * To get the AcctGroupHandlingAvailableInd
	 * 
	 * @return the acctGroupHandlingAvailableInd
	 */
	public String getAcctGroupHandlingAvailableInd()
	{
		return acctGroupHandlingAvailableInd;
	}

	/**
	 * To set the acctGroupHandlingAvailableInd
	 * 
	 * @param acctGroupHandlingAvailableInd the acctGroupHandlingAvailableInd to set
	 */
	public void setAcctGroupHandlingAvailableInd(String acctGroupHandlingAvailableInd)
	{
		this.acctGroupHandlingAvailableInd = acctGroupHandlingAvailableInd;
	}

	/**
	 * To get the acctGroupHandling
	 * 
	 * @return the acctGroupHandling
	 */
	public String getAcctGroupHandling()
	{
		return acctGroupHandling;
	}

	/**
	 * To set the acctGroupHandling
	 * 
	 * @param acctGroupHandling the acctGroupHandling to set
	 */
	public void setAcctGroupHandling(String acctGroupHandling)
	{
		this.acctGroupHandling = acctGroupHandling;
	}

	/**
	 * To get the Period
	 * 
	 * @return the Period
	 */

	public String getPeriod()
	{
		return period;
	}

	/**
	 * To set the Period
	 * 
	 * @param period to set
	 */

	public void setPeriod(String period)
	{
		this.period = period;
	}

	/**
	 * To get the SubPeriod
	 * 
	 * @return the SubPeriod
	 */
	public String getSubPeriod()
	{
		return subPeriod;
	}

	/**
	 * To set the SubPeriod
	 * 
	 * @param SubPeriod to set
	 */

	public void setSubPeriod(String subPeriod)
	{
		this.subPeriod = subPeriod;
	}

	/**
	 * To get the PeriodInd
	 * 
	 * @return the PeriodInd
	 */

	public String getPeriodInd()
	{
		return periodInd;
	}

	/**
	 * To set the PeriodInd
	 * 
	 * @param PeriodInd to set
	 */

	public void setPeriodInd(String periodInd)
	{
		this.periodInd = periodInd;
	}

	/**
	 * To get the FromDate
	 * 
	 * @return the FromDate
	 */

	public String getFromDate()
	{
		return fromDate;
	}

	/**
	 * To set the FromDate
	 * 
	 * @param FromDate to set
	 */

	public void setFromDate(String fromDate)
	{
		this.fromDate = fromDate;
	}

	/**
	 * To get the ToDate
	 * 
	 * @return the ToDate
	 */

	public String getToDate()
	{
		return toDate;
	}

	/**
	 * To set the ToDate
	 * 
	 * @param ToDate to set
	 */

	public void setToDate(String toDate)
	{
		this.toDate = toDate;
	}

	private String viewId = null;
	private String rateCardAvailableInd = ViewDefinitionConstants.VAL_BOOL_NO;
	private String rateCardId = null;
	private String referenceCcyAvailableInd = ViewDefinitionConstants.VAL_BOOL_NO;
	private String referenceCcy = null;
	private String lastColumnHandlingAvailableInd = ViewDefinitionConstants.VAL_BOOL_NO;
	private String lastColumnHandling = null;
	private String acctGroupHandlingAvailableInd = ViewDefinitionConstants.VAL_BOOL_NO;
	private String acctGroupHandling = null;
	private String period = null;
	private String subPeriod = null;
	private String periodInd = null;
	private String fromDate = null;
	private String toDate = null;
}
