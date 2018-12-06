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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.entitlement.FunctionVO;
import com.intellectdesign.canvas.entitlement.ProductFunctionVO;
import com.intellectdesign.canvas.entitlement.SubProductVO;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.ChannelUtils;

/**
 * This class is for context menu list
 * 
 * @version 1.0
 */
public class ContextMenuList
{

	/***
	 * This Method returns the context menus list based on the widget Id, gcif no and User no.
	 * 
	 * @param widgetId Widget ID
	 * @param gcifNo GCIF
	 * @param userNo User No
	 * @return List
	 * @throws ViewDefinitionException ViewDefinitionException
	 */
	public final List<ContextMenuNode> getContextListMenus(final String widgetId, final String gcifNo,
			final String userNo,final String device, final String sChannelId,final String sUserRole) throws ViewDefinitionException
	{

		ContextMenuInstruction instruction = new ContextMenuInstruction();

		List<ProductFunctionVO> productFunctionVOList = instruction.getproductFunctionVOList(gcifNo, userNo,sChannelId, sUserRole);
		logger.ctdebug("CTVDF00349", productFunctionVOList);

		logger.ctinfo("CTVDF00350");
		Map<String, ProductFunctionVO> productMap = new HashMap<String, ProductFunctionVO>();
		Map<String, ContextMenuNode> menuRefMap = new HashMap<String, ContextMenuNode>();
		List<ContextMenuNode> menuList = new ArrayList<ContextMenuNode>();
		String productCode = null;
		ContextMenuNode mNode = null;
		if(productFunctionVOList != null){
			for (ProductFunctionVO productFunctionVO : productFunctionVOList)
			{
				String prodCode = productFunctionVO.getProdCode();

				productMap.put(prodCode, productFunctionVO);
			}
		}
		logger.ctdebug("CTVDF00351", productMap);

		List<HashMap<String, String>> systemMenuList = instruction.getContextMenus(widgetId);
		logger.ctdebug("CTVDF00352", systemMenuList);

		List<SubProductVO> subprodVOs = null;
		List<FunctionVO> funcVOs = null;

		try
		{
			// If the systemMenuList is not empty
			if (systemMenuList.size() > 0)
			{

				for (Map<String, String> menuItem : systemMenuList)
				{
					productCode = null;
					// Checks if the newSystemMenuList is not empty
					if (!menuItem.isEmpty())
					{
						if (ChannelUtils.getDeviceFilter(menuItem.get("CHANNEL_ID"), device))
						{
							mNode = new ContextMenuNode(menuItem);

							productCode = mNode.getProductCode();
							// Checks If the product of the menu node with the product available in the products Map
							if (productMap.containsKey(productCode))
							{
								// Gets the subproduct-function VO list based on the product code from the products Map
								subprodVOs = productMap.get(productCode).getSubProdFuncList();
								for (SubProductVO subprodVO : subprodVOs)
								{
									// Checks if any map from the subproduct-function VO list contains the sub-product
									// code and
									// function code assigned to the current menu node
									if (subprodVO.getSubProdCode().equals(mNode.getSubProdCode()))
									{
										funcVOs = subprodVO.getFuncList();
										for (FunctionVO funcVO : funcVOs)
										{
											if (funcVO.getFuncCode().equals(mNode.getFuncCode()))
											{
												menuList.add(mNode);

												menuRefMap.put(mNode.getMenuId(), mNode);

												if (mNode.getParentId().length() > 0)
												{
													// If child nodes are available for the current menu, it is added to
													// its parent
													// menu node
													menuRefMap.get(mNode.getParentId()).addChildNode(mNode);

												}

											}
										}
									}
								}
							}
							// Else if the product code is not given for the current menu node
							else if (productCode.equals(""))
							{
								logger.ctdebug("CTVDF00353", productMap);
								// the current menu node is assigned to its menu Id
								menuRefMap.put(mNode.getMenuId(), mNode);
								// If the current menu node does not have a parent Id and this happens for the 1st node
								// which is
								// the View itself
								if (mNode.getParentId().equals(""))
								{
									// The 1st node is added which is the View itself
									menuList.add(mNode);
									logger.ctdebug("CTVDF00354", menuList);
								}
								// else if the current menu node contains parent id and is not a View by itself
								else if (mNode.getParentId().length() > 0)
								{
									// If child nodes are available for the current menu, it is added to its parent
									// menu node
									menuRefMap.get(mNode.getParentId()).addChildNode(mNode);
									logger.ctdebug("CTVDF00355", menuList);

								}
								logger.ctdebug("CTVDF00356", menuList);
							}
							logger.ctdebug("CTVDF00357", productCode);
						}

					}
				}

			}
		} catch (NullPointerException e)
		{
			logger.cterror("CTVDF00358", e);
			throw new ViewDefinitionException(e);

		}
		logger.ctdebug("CTVDF00359", menuList);

		logger.ctinfo("CTVDF00360");

		return menuList;

	}

	private Logger logger = Logger.getLogger(ContextMenuList.class);

}
