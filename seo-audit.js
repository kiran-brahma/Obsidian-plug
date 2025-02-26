// seo-audit.js
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch'; // Ensure node-fetch is installed in your plugin environment

async function fetchUrlContent(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      },
      timeout: 10000 // 10 seconds timeout
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error fetching URL content:", error);
    return null;
  }
}


export async function freeSeoAudit(url) {
    const auditResult = {};
    try {
        const responseText = await fetchUrlContent(url);
        if (!responseText) {
            return { error: "Failed to fetch URL content" };
        }
        const dom = new JSDOM(responseText);
        const document = dom.window.document;

        // Basic HTTP info (simulated as fetchUrlContent handles this)
        auditResult.http = {
            status: 200, // Assuming successful fetch if no error thrown
            using_https: url.startsWith("https://"),
            response_time: "Simulated", // Response time not directly available in this context
        };

        // Metadata
        const titleTag = document.querySelector("title");
        const descriptionTag = document.querySelector('meta[name="description"]');
        auditResult.metadata = {
            title: titleTag?.textContent || null,
            title_length: titleTag?.textContent?.length || 0,
            description: descriptionTag?.content || null,
            description_length: descriptionTag?.content?.length || 0,
        };

        // Basic content analysis
        const textContent = document.body.textContent;
        const headings = document.querySelectorAll("h1, h2, h3");
        auditResult.content = {
            word_count: textContent.split(/\s+/).length, // Basic word count
            h1_count: Array.from(headings).filter(h => h.tagName === 'H1').length,
            h2_count: Array.from(headings).filter(h => h.tagName === 'H2').length,
            h3_count: Array.from(headings).filter(h => h.tagName === 'H3').length,
        };

        // Basic link analysis
        const links = document.querySelectorAll("a");
        const internalLinks = Array.from(links).filter(link => new URL(link.href, url).hostname === new URL(url).hostname);
        const externalLinks = Array.from(links).filter(link => new URL(link.href, url).hostname !== new URL(url).hostname);
        auditResult.links = {
            total_links: links.length,
            internal_links: internalLinks.length,
            external_links: externalLinks.length,
        };

        // Basic image analysis
        const images = document.querySelectorAll("img");
        auditResult.images = {
            total_images: images.length,
            images_without_alt: Array.from(images).filter(img => !img.alt).length,
        };

        return auditResult;
    } catch (error) {
        console.error("Error during free SEO audit:", error);
        return { error: String(error) };
    }
}


export async function fullSeoAudit(url) {
    const auditResult = {};

    try {
        const responseText = await fetchUrlContent(url);
        if (!responseText) {
            return { error: "Failed to fetch URL content" };
        }
        const dom = new JSDOM(responseText, { url: url }); // Pass base URL for resolving relative URLs
        const document = dom.window.document;
        const response = dom.window; // To access response properties if needed

        const finalUrl = response.url;
        const usingHttps = finalUrl.startsWith("https://");

        const parsedUrl = new URL(url);
        const inputType = parsedUrl.pathname.replace(/^\/|\/$/g, '') === "" ? "Domain" : "URL with path";


        auditResult.Input = {
            URL: url,
            "Input type": inputType,
        };


        auditResult.http = {
            status: 200, //Simulated
            using_https: usingHttps,
            response_time: "Simulated",
        };


        const titleTag = document.querySelector("title");
        const titleData = titleTag ? titleTag.textContent : "";
        const titleLength = titleData.length;
        const titleTagNumber = document.querySelectorAll("title").length;

        auditResult.title = {
            found: titleTag ? "Found" : "Not found",
            data: titleData,
            length: titleLength,
            characters: titleTag?.textContent?.length || 0,
            words: titleTag?.textContent?.split(/\s+/).length || 0,
            charPerWord: titleTag?.textContent ? Math.round(titleLength / titleTag.textContent.split(/\s+/).length * 100) / 100 : 0,
            "tag number": titleTagNumber,
        };


        const descriptionTag = document.querySelector('meta[name="description"]');
        const descriptionData = descriptionTag ? descriptionTag.content : "";
        const descriptionLength = descriptionData.length;
        const metaDescriptionNumber = document.querySelectorAll('meta[name="description"]').length;

        auditResult.meta_description = {
            found: descriptionTag ? "Found" : "Not found",
            data: descriptionData,
            length: descriptionLength,
            characters: descriptionTag?.content?.length || 0,
            words: descriptionTag?.content?.split(/\s+/).length || 0,
            charPerWord: descriptionTag?.content ? Math.round(descriptionLength / descriptionTag.content.split(/\s+/).length * 100) / 100 : 0,
            number: metaDescriptionNumber,
        };


        const metadataInfo = {};
        const charsetTag = document.querySelector('meta[charset]');
        metadataInfo.charset = charsetTag ? charsetTag.getAttribute('charset') : null;

        const canonicalTag = document.querySelector('link[rel="canonical"]');
        metadataInfo.canonical = canonicalTag ? canonicalTag.href : null;

        const faviconTag = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
        metadataInfo.favicon = faviconTag ? faviconTag.href : null;

        const viewportTag = document.querySelector('meta[name="viewport"]');
        metadataInfo.viewport = viewportTag ? viewportTag.content : null;

        const keywordsTag = document.querySelector('meta[name="keywords"]');
        metadataInfo.keywords = keywordsTag ? keywordsTag.content : null;

        const localeTag = document.querySelector('meta[property="og:locale"]');
        metadataInfo.locale = localeTag ? localeTag.content : null;

        const contentTypeTag = document.querySelector('meta[property="og:type"]');
        metadataInfo.contentType = contentTypeTag ? contentTypeTag.content : null;

        const siteNameTag = document.querySelector('meta[property="og:site_name"]');
        metadataInfo.site_name = siteNameTag ? siteNameTag.content : null;

        const siteImageTag = document.querySelector('meta[property="og:image"]');
        metadataInfo.site_image = siteImageTag ? siteImageTag.content : null;

        const robotsTag = document.querySelector('meta[name="robots"]');
        metadataInfo.robots = robotsTag ? robotsTag.content : null;


        metadataInfo.hreflangs = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(tag => ({
            language: tag.hreflang,
            url: tag.href
        }));


        auditResult.metadata_info = metadataInfo;


        const headings = {};
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].forEach(h => {
            headings[h] = document.querySelectorAll(h.toLowerCase()).length;
        });

        const h1ContentElement = document.querySelector("h1");
        const h1Content = h1ContentElement ? h1ContentElement.textContent : "";

        auditResult["Page Headings summary"] = {
            ...headings,
            "H1 count": document.querySelectorAll("h1").length,
            "H1 Content": h1Content,
        };


        const textContent = document.body.textContent.toLowerCase();
        const words = textContent.matchAll(/\b\w+\b/g);
        const wordCountTotal = Array.from(words).length;


        const anchorElements = document.querySelectorAll("a");
        let anchorText = '';
        anchorElements.forEach(a => {
            anchorText += a.textContent.trim() + " ";
        });
        const anchorTextWords = anchorText.split(/\s+/).filter(word => word).length;
        const anchorPercentage = wordCountTotal > 0 ? Math.round((anchorTextWords / wordCountTotal) * 10000) / 100 : 0;


        auditResult.word_count = {
            total: wordCountTotal,
            "Corrected word count": wordCountTotal,
            "Anchor text words": anchorTextWords,
            "Anchor Percentage": anchorPercentage,
        };


        const links = document.querySelectorAll("a");
        const totalLinks = links.length;
        let externalLinksCount = 0;
        let internalLinksCount = 0;
        let nofollowCount = 0;

        links.forEach(link => {
            if (link.href.startsWith('http')) {
                externalLinksCount++;
            } else {
                internalLinksCount++;
            }
            if (link.relList.contains('nofollow')) {
                nofollowCount++;
            }
        });


        const linksData = Array.from(document.links).map(link => ({
            href: link.href,
            text: link.textContent.trim()
        }));


        auditResult.links_summary = {
            "Total links": totalLinks,
            "External links": externalLinksCount,
            "Internal": internalLinksCount,
            "Nofollow count": nofollowCount,
            links: linksData,
        };


        const images = document.querySelectorAll("img");
        const numberOfImages = images.length;
        const imageData = Array.from(images).map(img => ({
            src: img.getAttribute("src") || "",
            alt: img.getAttribute("alt") || ""
        }));


        auditResult.images_analysis = {
            summary: {
                total: numberOfImages,
                "No src tag": Array.from(images).filter(img => !img.getAttribute("src")).length,
                "No alt tag": Array.from(images).filter(img => !img.getAttribute("alt")).length,
            },
            data: imageData,
        };


    } catch (error) {
        console.error("Error during full SEO audit:", error);
        return { error: String(error) };
    }

    return auditResult;
}
