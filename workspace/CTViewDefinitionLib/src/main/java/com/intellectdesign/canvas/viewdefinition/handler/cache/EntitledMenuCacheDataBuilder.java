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

package com.intellectdesign.canvas.viewdefinition.handler.cache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.cache.handler.CacheDataBuilder;
import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.entitlement.EntitlementException;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.entitlement.FunctionVO;
import com.intellectdesign.canvas.entitlement.ProductFunctionVO;
import com.intellectdesign.canvas.entitlement.SubProductVO;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.viewdefinition.MenuNode;

/**
 * This class is for entitled menu cache builder extends cache handler.
 * 
 * @version 1.0
 */
public class EntitledMenuCacheDataBuilder extends CacheDataBuilder
{
	private Logger logger = Logger.getLogger(EntitledMenuCacheDataBuilder.class);

	/**
	 * This is ref to List InitCache to EntitledMenuCacheHandle
	 * 
	 * @param hashMap
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#initializeCache(java.util.HashMap)
	 */
	@Override
	protected List initializeCache(HashMap hashMap)
	{
		List<MenuNode> menuList = new ArrayList<MenuNode>();
		SessionInfo sessInfo = null;

		sessInfo = (SessionInfo) hashMap.get(CacheConstants.OBJECT_SESSIONINFO);
		if (sessInfo == null)
		{
			logger.cterror("CTVDF00212", sessInfo);
			return null;
		}
		List<ProductFunctionVO> productFunctionVOList = getproductFunctionVOList(sessInfo);

		if (productFunctionVOList != null)
			menuList = getEntitledMenus(productFunctionVOList);
		return menuList;
	}

	/**
	 * this is ref to vaildparams
	 * 
	 * @param params
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.CacheDataBuilder#validateParameters(java.util.HashMap)
	 */
	@Override
	protected String validateParameters(HashMap params)
	{

		return null;
	}

	/**
	 * thisis ref to List menu Map Nodes
	 * 
	 * @param productFunctionVOList
	 * @return menulist
	 */
	private List<MenuNode> getEntitledMenus(List<ProductFunctionVO> productFunctionVOList)
	{
		logger.ctinfo("CTVDF00213");
		Map<String, ProductFunctionVO> productMap = new HashMap<String, ProductFunctionVO>();
		Map<String, MenuNode> menuRefMap = new HashMap<String, MenuNode>();
		List<MenuNode> menuList = new ArrayList<MenuNode>();
		String productCode = null;
		MenuNode mNode = null;
		for (ProductFunctionVO productFunctionVO : productFunctionVOList)
		{
			productMap.put(productFunctionVO.getProdCode(), productFunctionVO);
		}
		CacheManager cacheManager = CacheManager.getFWInstance();
		List<Map<String, String>> systemMenuList = cacheManager.getDataFromCache(null,
				FrameworkConstants.APP_MENU_ITEMS_META);

		List<SubProductVO> subprodVOs = null;
		List<FunctionVO> funcVOs = null;

		for (Map<String, String> menuItem : systemMenuList)
		{
			productCode = null;
			if (menuItem != null && !menuItem.isEmpty())
			{
				mNode = new MenuNode(menuItem);

				productCode = mNode.getOd_product_code();
				if (productCode != null)
				{
					if (productMap.containsKey(productCode))
					{
						subprodVOs = productMap.get(productCode).getSubProdFuncList();
						for (SubProductVO subprodVO : subprodVOs)
						{
							if (subprodVO.getSubProdCode().equals(mNode.getOd_subprod_code()))

							{
								funcVOs = subprodVO.getFuncList();
								for (FunctionVO funcVO : funcVOs)
								{

									if (funcVO.getFuncCode().equals(mNode.getOd_function_code()))
									{
										menuRefMap.put(mNode.getItem_id(), mNode);
										if (mNode.getParent_id() != null && mNode.getParent_id().length() > 0)
										{
											if (menuRefMap.get(mNode.getParent_id()) != null)
											{
												menuRefMap.get(mNode.getParent_id()).addChildNode(mNode);
											}
										} else
										{
											menuList.add(mNode);
										}

									}

								}
							}

						}
					} else if (productCode.equals(""))
					{
						menuRefMap.put(mNode.getItem_id(), mNode);
						if (mNode.getParent_id() == null || mNode.getParent_id().equals(""))
						{
							menuList.add(mNode);
						}
						if (mNode.getParent_id() != null && mNode.getParent_id().length() > 0)
						{
							if (menuRefMap.get(mNode.getParent_id()) != null)
							{
								menuRefMap.get(mNode.getParent_id()).addChildNode(mNode);
							}
						}
					}
					logger.ctdebug("CTVDF00214", productCode);
				}
			}
		}

		logger.ctinfo("CTVDF00215");

		return menuList;
	}

	/**
	 * This method retrieves the list of entitled ProductFunctionVO for the logged in user based on sessInfo The return
	 * is a list of ProductFunctionVO All of the input parameters are mandatory.
	 * 
	 * @param SessionInfo
	 * @return a list of ProductFunctionVO
	 * @throws
	 */
	private List<ProductFunctionVO> getproductFunctionVOList(SessionInfo sessInfo)
	{
		logger.ctinfo("CTVDF00216");
		String gcif = null;
		String userno = null;
		List<ProductFunctionVO> productFunctionVOList = null;

		gcif = sessInfo.sCustNo;
		userno = sessInfo.userNo;

		logger.ctdebug("CTVDF00217", gcif, userno);
		if (gcif == null || userno == null)
		{
			logger.cterror("CTVDF00218");
			return null;
		}

		EntitlementsHelper entlHelper = new EntitlementsHelper();
		try
		{
			productFunctionVOList = entlHelper.getUserAccessEntitlements(gcif, userno)
					.getEntitlementsAsProductFunction();
		} catch (EntitlementException e)
		{
			logger.cterror("CTVDF00814", gcif, userno, e);
		}

		logger.ctinfo("CTVDF00219");
		return productFunctionVOList;
	}

}
