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

package com.intellectdesign.canvas.report.instr;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.entitlement.FunctionVO;
import com.intellectdesign.canvas.entitlement.ProductFunctionVO;
import com.intellectdesign.canvas.entitlement.SubProductVO;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.tree.ITreeNode;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.instruction.TreeListInstruction;

/**
 * This class is responsible for providing the tree view of the Available Reports
 * 
 * @version 1.0
 */
public class AvailableReportInstruction extends TreeListInstruction
{
	/**
	 * This method is responsible for filtering the view on the basis of the specific filters provided.
	 * 
	 * @param hmInputParams HashMap
	 * @param dataEntitlements DataEntitlements
	 * @return mapViewSpecificFilter
	 * @throws ViewDefinitionException
	 */
	public HashMap getViewSpecificFilters(HashMap hmInputParams, DataEntitlements dataEntitlements)
			throws ViewDefinitionException
	{
		logger.ctinfo("CTREP00198");
		PerformanceTimer perfTimer = null;
		perfTimer = new PerformanceTimer();
		String gcifNo = (String) hmInputParams.get(ReportConstants.INPUT_GCIF);
		String userNo = (String) hmInputParams.get(ReportConstants.INPUT_USER_NO);

		HashMap mapViewSpecificFilter = new HashMap();
		mapViewSpecificFilter.put(ReportConstants.GCIF, gcifNo);
		mapViewSpecificFilter.put(ReportConstants.USER_NO, userNo);
		List entlt=dataEntitlements.getEntitlements();
		List prodList=new ArrayList();
		List subProdList=new ArrayList();
		List funCodeList=new ArrayList();
		for (int i = 0; i < entlt.size(); i++)
		{
			 ProductFunctionVO pdVo=(ProductFunctionVO)entlt.get(i);
			 HashMap tmp= new HashMap();
			 tmp.put("prodCode", pdVo.getProdCode());
			prodList.add(tmp);
			List<SubProductVO> subProd = pdVo.getSubProdFuncList();
			for (int j = 0; j < subProd.size(); j++)
			{
				HashMap subProdtmp = new HashMap();
				subProdtmp.put("subProdCode", subProd.get(j).getSubProdCode());
				subProdList.add(subProdtmp);
				List<FunctionVO> funList = subProd.get(j).getFuncList();
				for (int k = 0; k < funList.size(); k++)
				{
					HashMap funCodetmp = new HashMap();
					funCodetmp.put("funCode", funList.get(k).getFuncCode());
					funCodeList.add(funCodetmp);
				}
			}
		}
		mapViewSpecificFilter.put(ReportConstants.PRODUCT_LIST, prodList);
		mapViewSpecificFilter.put(ReportConstants.SUB_PRODUCT_LIST, subProdList);
		mapViewSpecificFilter.put(ReportConstants.FUNCTION_LIST, funCodeList);
		logger.ctinfo("CTREP00199", mapViewSpecificFilter);
		perfTimer.endTimer();
		return mapViewSpecificFilter;
	}

	/**
	 * @return null
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#getUniqueSortFieldName()
	 */
	protected String getUniqueSortFieldName()
	{
		return null;
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#getUniqueSortFieldOrder()
	 */
	protected String getUniqueSortFieldOrder()
	{
		return null;
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.viewdefinition.SimpleViewDefinitionInstruction#getSortColumnMap()
	 */
	protected HashMap<String, String> getSortColumnMap()
	{
		HashMap<String, String> strListViewColumnMap = new HashMap<String, String>();
		strListViewColumnMap.put(ReportConstants.REPORT_NAME, ReportConstants.REPORT_NAME);
		return strListViewColumnMap;
	}

	/**
	 * @param treeList ArrayList<HashMap<String, String>>
	 * @return menuList This method is responsible for set the data in the view as Tree structure.
	 */
	public ArrayList<ITreeNode> getDataAsTreeStructure(ArrayList<HashMap<String, String>> treeList,
			HashMap hmInputParams)
	{
		logger.ctinfo("CTREP00200");
		logger.ctdebug("CTREP00201", treeList);
		List<Map<String, String>> systemMenuList = (List) treeList;
		logger.ctdebug("CTREP00202", systemMenuList);
		Map<String, ReportTreeNode> menuRefMap = new HashMap<String, ReportTreeNode>();
		ReportTreeNode mNode = null;
		ArrayList<ReportTreeNode> menuList = new ArrayList<ReportTreeNode>();
		for (Map<String, String> menuItem : systemMenuList)
		{
			if (menuItem != null && !menuItem.isEmpty())
			{
				mNode = new ReportTreeNode(menuItem);
				menuRefMap.put(mNode.getReportId(), mNode);
				if (mNode.getParentReportId() == null || mNode.getParentReportId().equals(ReportConstants.DUMMY_ID))
				{
					menuList.add(mNode);
				}
				if (mNode.getParentReportId() != null && mNode.getParentReportId().length() > 0)
				{
					if (menuRefMap.get(mNode.getParentReportId()) != null)
					{
						menuRefMap.get(mNode.getParentReportId()).addChildNode(mNode);
					}
				}
			}
		}
		ArrayList updatedMenuList = new ArrayList();
		for (ReportTreeNode newNode : menuList)
		{
			updatedMenuList.add(newNode.getReportTreeNodeAsMap());
		}
		logger.ctinfo("CTREP00203", menuList);
		return updatedMenuList;
	}

	/**
	 *@return  String: canvas datasource
	 */
	@Override
	protected String getDataSource()
	{
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		return configMgr.getDBDescriptor().getCtFWIBATISDSKey();
	}
	
	/**
	 * instatiating logger
	 */
	private static Logger logger = Logger.getLogger(AvailableReportInstruction.class);

}
