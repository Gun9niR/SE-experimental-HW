Use [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) to evaluate https://www.sjtu.edu.cn
# Issues
- Images are unnecessarily large (rendered size of the images are at least 4KB smaller than the actual size)
- Offscreen images aren't deferred for loading
- Reusable resources (images, .js/.css files) aren't cached
- Huge network payloads

# Optimizations
- Compress images to smaller sizes
- Add the attribute `loading="lazy"` to offscreen images
- Add `<meta http-equiv="Cache-Control" content="max-age=604800">` in the head section to cache static resources for a week
- Convert images to WebP format to reduce file size