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

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.tree.ITreeNode;

/**
 * This class is responsible for setting the values for tree view
 * 
 * @version 1.0
 */

public class ReportTreeNode implements ITreeNode
{
	/**
	 * setting serialVersionUID as 1L.
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * declaring String reportId.
	 */
	private String reportId;
	/**
	 * declaring String reportName.
	 */
	private String reportName;
	/**
	 * declaring String parentReportId.
	 */
	private String parentReportId;

	/**
	 * declaring String reportProdCode.
	 */
	private String reportProdCode;
	/**
	 * declaring String reportSubProdCode.
	 */
	private String reportSubProdCode;
	/**
	 * declaring String reportFuncCode.
	 */
	private String reportFuncCode;

	/**
	 * declaring String nodeCls
	 */
	private String nodeCls = "unScheduledNode";

	/**
	 * declaring String isActive
	 */
	private String isActive = "Y";

	/**
	 * declaring String isScheduled.
	 */
	private String isScheduled;
	/**
	 * declaring List childNodes.
	 */
	private List<ReportTreeNode> childNodes;

	/**
	 * creating instance of ReportTreeNode.
	 */
	public ReportTreeNode()
	{
		childNodes = new ArrayList<ReportTreeNode>();
	}

	/**
	 * @param map Map<String, String> This method sets the value of the tree nodes.
	 */

	public ReportTreeNode(final Map<String, String> map)
	{
		logger.ctinfo("CTREP00302");
		setReportId(map.get(ReportConstants.REPORTID));
		setReportName(map.get(ReportConstants.REPORTNAME));
		setParentReportId(map.get(ReportConstants.PARENT_REPORTID));

		setReportProdCode(map.get(ReportConstants.REPORTPRODCODE));
		setReportSubProdCode(map.get(ReportConstants.REPORTSUBPRODCODE));
		setReportFuncCode(map.get(ReportConstants.REPORTFUNCCODE));
		setIsActive(map.get(ReportConstants.IS__ACTIVE));

		setIsScheduled(map.get(ReportConstants.IS__SCHEDULED));
		childNodes = new ArrayList<ReportTreeNode>();
		logger.ctinfo("CTREP00303");
	}

	/**
	 * @return HashMap:treeMenu
	 * 
	 * */
	public HashMap getReportTreeNodeAsMap()
	{
		logger.ctinfo("CTREP00304");
		HashMap treeMenu = new HashMap();
		treeMenu.put(ReportConstants.REPORT_ID, getReportId());
		treeMenu.put(ReportConstants.REPORT_TREE_NODE_NAME, getReportName());
		treeMenu.put(ReportConstants.PARENT_REPORTID, getParentReportId());

		treeMenu.put(ReportConstants.REPORT_PROD_CODE, getReportProdCode());
		treeMenu.put(ReportConstants.REPORT_SUB_PROD_CODE, getReportSubProdCode());
		treeMenu.put(ReportConstants.REPORT_FUNC_CODE, getReportFuncCode());
		treeMenu.put(ReportConstants.IS__SCHEDULED, getIsScheduled());
		treeMenu.put(ReportConstants.NODE_CLS, nodeCls);

		List childMap = new ArrayList();
		if (childNodes != null && !childNodes.isEmpty())
		{
			for (ReportTreeNode mNode : childNodes)
			{
				childMap.add(mNode.getReportTreeNodeAsMap());
			}
		}
		treeMenu.put(ReportConstants.CHILDREN, childMap);
		logger.ctinfo("CTREP00305");
		return treeMenu;
	}

	/**
	 * @return sb.toString() This method is responsible for appending child nodes to its parent node
	 */
	public final String toJSONString()
	{
		logger.ctinfo("CTREP00306");
		StringBuffer sb = new StringBuffer();
		sb.append(ReportConstants.REPORT_ID + ":'" + reportId + "',");
		sb.append(ReportConstants.REPORT_TREE_NODE_NAME + ":'" + reportName + "',");

		sb.append(ReportConstants.REPORT_PROD_CODE + ":'" + reportProdCode + "',");
		sb.append(ReportConstants.REPORT_SUB_PROD_CODE + ":'" + reportSubProdCode + "',");
		sb.append(ReportConstants.REPORT_FUNC_CODE + ":'" + reportFuncCode + "',");
		sb.append(ReportConstants.PARENT_REPORT_ID + ":'" + parentReportId + "',");
		sb.append(ReportConstants.IS_SCHEDULED + ":'" + isScheduled + "',");
		sb.append(ReportConstants.NODE_CLS + ":'" + nodeCls + "',");

		StringBuffer sb1 = new StringBuffer();
		for (ReportTreeNode mn : childNodes)
		{
			sb1.append(mn.toJSONString() + ",");
		}
		String nodes = sb1.toString();
		if (nodes.length() > 0)
		{
			nodes = nodes.substring(0, nodes.length() - 1);
		}
		sb.append("children:" + "[" + nodes + "]");
		logger.ctinfo("CTREP00307", sb);
		return "{" + sb.toString() + "}";
	}

	/**
	 * @param mn ReportTreeNode
	 */
	public final void addChildNode(final ReportTreeNode mn)
	{
		childNodes.add(mn);
	}

	/**
	 * @return reportId
	 */
	public String getReportId()
	{
		return reportId;
	}

	/**
	 * @param reportid String
	 */
	public void setReportId(String reportId)
	{
		this.reportId = reportId;
	}

	/**
	 * @return reportName
	 */
	public String getReportName()
	{
		return reportName;
	}

	/**
	 * @param reportname String
	 */
	public void setReportName(String reportName)
	{
		this.reportName = reportName;
	}

	/**
	 * @return parentReportId
	 */
	public String getParentReportId()
	{
		return parentReportId;
	}

	/**
	 * @param parentreportId String
	 */
	public void setParentReportId(String parentReportId)
	{
		this.parentReportId = parentReportId;
	}

	/**
	 * @return the reportProdCode
	 */
	public String getReportProdCode()
	{
		return reportProdCode;
	}

	/**
	 * @param reportProdCode the reportProdCode to set
	 */
	public void setReportProdCode(String reportProdCode)
	{
		this.reportProdCode = reportProdCode;
	}

	/**
	 * @return the reportSubProdCode
	 */
	public String getReportSubProdCode()
	{
		return reportSubProdCode;
	}

	/**
	 * @param reportSubProdCode the reportSubProdCode to set
	 */
	public void setReportSubProdCode(String reportSubProdCode)
	{
		this.reportSubProdCode = reportSubProdCode;
	}

	/**
	 * @return the reportFuncCode
	 */
	public String getReportFuncCode()
	{
		return reportFuncCode;
	}

	/**
	 * @param reportFuncCode the reportFuncCode to set
	 */
	public void setReportFuncCode(String reportFuncCode)
	{
		this.reportFuncCode = reportFuncCode;
	}

	/**
	 * @return isScheduled
	 */
	public String getIsScheduled()
	{
		return isScheduled;
	}

	/**
	 * @param scheduled String
	 */

	public void setIsScheduled(String isScheduled)
	{
		this.isScheduled = isScheduled;
		/** Setting the appropriate nodeCls value */
		if (ReportConstants.YES_IND.equals(isScheduled))
		{
			if (ReportConstants.YES_IND.equals(isActive))
			{
				nodeCls = "activeScheduledNode";
			} else
			{
				nodeCls = "scheduledNode";
			}
		}
	}

	/**
	 * @param isActive the isActive to set
	 */
	public void setIsActive(String isActive)
	{
		this.isActive = isActive;
	}

	/**
	 * @return the isActive
	 */
	public String getIsActive()
	{
		return isActive;
	}

	/**
	 * @return childNodes
	 */

	public List<ReportTreeNode> getChildNodes()
	{
		return childNodes;
	}

	/**
	 * @param childnodes List<ReportTreeNode>
	 */
	public void setChildNodes(List<ReportTreeNode> childNodes)
	{
		this.childNodes = childNodes;
	}

	// instatiating the logger object
	private Logger logger = Logger.getLogger(ReportTreeNode.class);
}
