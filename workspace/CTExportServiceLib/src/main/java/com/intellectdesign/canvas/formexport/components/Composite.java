package com.intellectdesign.canvas.formexport.components;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.rendersnake.HtmlAttributes;
import org.rendersnake.HtmlCanvas;
import org.rendersnake.Renderable;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.formexport.framework.FormExportItemCreator;
import com.intellectdesign.canvas.formexport.framework.FormExportModel;

/********************************************************************************************************************
 * CHANGE CODE			AUTHOR				DATE				DESC
 * -----------------------------------------------------------------------------------------------------------------
 * CHG001_70501			ANITHA				23/11/2013			CHANGES FOR CURR AND AMT IN BOLD ISSUE.	
 * 
 *
 ******************************************************************************************************************/

public class Composite implements Renderable{
	
	FormExportModel formModel;
	String itemId;
	Map item;

	private Composite() {

	}

	public Composite(FormExportModel formModel, String itemId, Map item) {

		this.formModel = formModel;
		this.itemId = itemId;
		this.item = item;
	}
	public void renderOn(HtmlCanvas html) throws IOException {
		
			FormExportItemCreator itemCreator = new FormExportItemCreator(formModel,itemId);
			List itemArray = itemCreator.getChildItems();
			if(itemArray == null){
				return ;
			}
			
			String label="";
			if("?LBL_?".equals((String) item.get("FIELD_LABEL")) )
				label="";
			else
				label=(String) item.get("FIELD_LABEL");
			
			UserValue userValue = this.formModel.getUserInfo();
			String direction = userValue.getDirection();
			if (direction != null && (direction.equalsIgnoreCase("RTL")) && this.formModel.getExportFormat().equalsIgnoreCase("FORMPDF")){
				renderValue(html);
				renderKey(html);
			}else{
				renderKey(html);
				renderValue(html);			
			}		  
	  	}
	private void renderKey(HtmlCanvas html) throws IOException {
		String label="";
		if("?LBL_?".equals((String) item.get("FIELD_LABEL")) )
			label="";
		else
			label=(String) item.get("FIELD_LABEL");
			html.td(new HtmlAttributes().width("20%"))
			.div(new HtmlAttributes().class_("headerTD_PDF REV_UNICODE")).content(label) 
		._td();
	}
			
	private void renderValue(HtmlCanvas html) throws IOException {
			String value="",cellNo="";
		FormExportItemCreator itemCreator = new FormExportItemCreator(formModel,itemId);
		List itemArray = itemCreator.getChildItems();
			int itemIndex=0;
			for(itemIndex=0 ;itemIndex<itemArray.size();){
				  for(int tempColCount =0 ;tempColCount<2;tempColCount++)
				  {		
					  if(itemIndex<itemArray.size()){
			
						//CBXFW_DIT_77 starts
						  Map itemMetadata = this.formModel.getItemData((String) itemArray.get(itemIndex));
						
						  String itemType = itemCreator.componentRenderMapping.get(itemMetadata.get("itemType"));
						  String printReqInd = (String)itemMetadata.get("PRINT_REQUIRED_IND");
						 if("Y".equals((String)itemMetadata.get("VISIBLE_IND")) && !"N".equals(printReqInd) && ("TextField".equals(itemType) || "ListField".equals(itemType) || "LabelField".equals(itemType) || "HtmlPanel".equals(itemType) ||  "TextArea".equals(itemType)))
						  {
						  if(value!="")
						  value=value+"  "+(String)itemMetadata.get("screenViewData");
						  else
							 value=(String)itemMetadata.get("screenViewData");
						  }
						  itemIndex++;
						  
			
						 
					  }
				  }
				 
				  
			}
			
			if(value!=""){
				html.td(new HtmlAttributes().width("20%"))
				.div(new HtmlAttributes().class_("NormalTD_PDF")).content(value)
			._td();
			  
			 
			}
			
			  
			 
			  
			  	}
	}
