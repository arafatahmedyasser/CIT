package org.xhtmlrenderer.extend;

import org.w3c.dom.Element;
import org.xhtmlrenderer.layout.LayoutContext;
import org.xhtmlrenderer.pdf.ITextImageElement;
import org.xhtmlrenderer.pdf.ITextOutputDevice;
import org.xhtmlrenderer.pdf.ITextReplacedElementFactory;
import org.xhtmlrenderer.render.BlockBox;
import org.xhtmlrenderer.simple.extend.FormSubmissionListener;

public class RTLTextReplacedElementFactory implements ReplacedElementFactory
{

	private String cssClassName;

	private ITextReplacedElementFactory defaultFactory;

	public RTLTextReplacedElementFactory(ITextOutputDevice outputDevice, String cssClassName)
	{
		checkNotNull(outputDevice, "outputDevice");
		checkNotNull(cssClassName, "cssClassName");
		defaultFactory = new ITextReplacedElementFactory(outputDevice);
		this.cssClassName = cssClassName;
	}

	public ReplacedElement createReplacedElement(LayoutContext c, BlockBox box, UserAgentCallback uac, int cssWidth,
			int cssHeight)
	{
		Element element = box.getElement();

		if (element == null)
		{
			return null;
		}
		String nodeName = element.getNodeName();

		if (element.getAttribute("class").contains(cssClassName)
				|| element.getAttribute("style").contains("Traditional Arabic"))
		{
			String text = element.getTextContent().replaceAll("(?m)\\s+", " ");
			return new org.xhtmlrenderer.pdf.RTLText(c, box, uac, cssWidth, cssHeight, text);
		} else if ((nodeName.equals("img") && element.getAttribute("src") != null))
		{
			FSImage fsImage = uac.getImageResource(element.getAttribute("src")).getImage();
			if (fsImage != null)
			{
				if (cssWidth != -1 || cssHeight != -1)
				{
					fsImage.scale(cssWidth, cssHeight);
				}
				return new ITextImageElement(fsImage);
			} else
			{
				return defaultFactory.createReplacedElement(c, box, uac, cssWidth, cssHeight);
			}
		} else
		{
			return defaultFactory.createReplacedElement(c, box, uac, cssWidth, cssHeight);
		}
	}

	public void reset()
	{
	}

	public void remove(Element e)
	{
	}

	public void setFormSubmissionListener(FormSubmissionListener listener)
	{
	}

	public void checkNotNull(Object o, String parameterName)
	{
		if (o == null)
		{
			throw new NullPointerException("parameter '" + parameterName + "' can not be null");
		}

	}
}