# Created by Claude · INTERNAL — builds src/app/hesap-karti/atmMap.ts from the
# comp's exported neler-atm-map.svg: vector data untouched; each ATM pin is
# wrapped in an animatable <g>, ordered by distance from the "you" dot.
import xml.etree.ElementTree as ET, math, sys, json
NS='http://www.w3.org/2000/svg'; ET.register_namespace('',NS)
src, out = sys.argv[1], sys.argv[2]
root=ET.parse(src).getroot()
YOU=(250.0, 236.0)   # map coords: a crossing between the big ATM and the left pins
kids=list(root)
pins=[]
for c in kids:
    if c.tag==f'{{{NS}}}svg' and any((g.get('id') or '').endswith('_fill') for g in c):
        x,y,w,h=(float(c.get(k)) for k in ('x','y','width','height'))
        pins.append((c,(x+w/2,y+h),w))
for c,_,_ in pins: root.remove(c)
fade=[c for c in root if c.tag==f'{{{NS}}}rect' and 'atm_fade' in (c.get('fill') or '')]
idx=list(root).index(fade[0]) if fade else len(root)
pins.sort(key=lambda p: math.dist(p[1],YOU))
dist=[]
ins=[]
wave=ET.Element(f'{{{NS}}}circle',{'class':'dbc-atm__wave','cx':str(YOU[0]),'cy':str(YOU[1]),'r':'420','fill':'none','stroke':'#5D3EBC','stroke-width':'1.5','vector-effect':'non-scaling-stroke'})
ins.append(wave)
for i,(c,(ax,ay),w) in enumerate(pins):
    g=ET.Element(f'{{{NS}}}g',{'class':'dbc-atm__pin'+(' dbc-atm__pin--main' if w>50 else '')})
    g.append(c); ins.append(g); dist.append(round(math.dist((ax,ay),YOU),1))
you=ET.Element(f'{{{NS}}}g',{'class':'dbc-atm__you'})
ET.SubElement(you,f'{{{NS}}}circle',{'class':'dbc-atm__halo','cx':str(YOU[0]),'cy':str(YOU[1]),'r':'16','fill':'#5D3EBC','opacity':'.16'})
ET.SubElement(you,f'{{{NS}}}circle',{'class':'dbc-atm__dot','cx':str(YOU[0]),'cy':str(YOU[1]),'r':'6.5','fill':'#5D3EBC','stroke':'#fff','stroke-width':'2.5'})
for k,e in enumerate(ins): root.insert(idx+k,e)
# the dot sits ABOVE the edge fade so it stays crisp
root.append(you)
root.set('class','dbc-extras__map'); root.set('aria-hidden','true')
for a in ('style',): root.attrib.pop(a,None)
svg=ET.tostring(root,encoding='unicode')
open(out,'w').write(f'''/* Created by Claude · INTERNAL — GENERATED from public/assets/img/hesap-karti/
   neler-atm-map.svg by scripts/gen-atm-map.py; do not hand-edit the markup.
   The comp's map, untouched, with each ATM pin wrapped in a
   `.dbc-atm__pin` group (nearest the "you" dot first), a `.dbc-atm__wave`
   ring under the edge fade, and the `.dbc-atm__you` dot above it. */

/** "you" dot, in map px (600 × 440) */
export const ATM_YOU = {{ x: {YOU[0]}, y: {YOU[1]} }};
/** each pin's distance from the dot, in DOM order (map px) */
export const ATM_PIN_DIST = {json.dumps(dist)};
export const ATM_MAP_SVG = {json.dumps(svg)};
''')
print(len(pins), dist)
