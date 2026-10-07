// blurfaces in.mov out.mov scale : finds every face (Vision), blurs it in every frame, keeps the sound
import AVFoundation
import Vision
import CoreImage
import AppKit
let a = CommandLine.arguments
let src = URL(fileURLWithPath: a[1]), dst = URL(fileURLWithPath: a[2]); let scale = CGFloat(Double(a[3]) ?? 1/3)
let asset = AVURLAsset(url: src)
let vtrack = asset.tracks(withMediaType: .video)[0]
let comp = AVMutableVideoComposition(propertiesOf: asset)          // applies the rotation, frames come out upright
let size = comp.renderSize
func reader() -> (AVAssetReader, AVAssetReaderVideoCompositionOutput) {
  let r = try! AVAssetReader(asset: asset)
  let o = AVAssetReaderVideoCompositionOutput(videoTracks: [vtrack], videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
  o.videoComposition = comp; r.add(o); r.startReading(); return (r, o)
}
// pass 1: faces per frame (normalised rects, origin bottom-left)
var faces: [[CGRect]] = []; var times: [CMTime] = []
do { let (_, o) = reader()
  while let sb = o.copyNextSampleBuffer() { guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
    let req = VNDetectFaceRectanglesRequest(); req.revision = VNDetectFaceRectanglesRequestRevision3
    try? VNImageRequestHandler(cvPixelBuffer: pb, options: [:]).perform([req])
    let hum = VNDetectHumanRectanglesRequest(); hum.upperBodyOnly = true
    try? VNImageRequestHandler(cvPixelBuffer: pb, options: [:]).perform([hum])
    var rs = (req.results ?? []).map { $0.boundingBox }
    // heads of people whose face is turned away or too small: top fifth of an upper-body box
    for h in (hum.results ?? []) { let b = h.boundingBox; rs.append(CGRect(x: b.minX + b.width*0.15, y: b.maxY - b.height*0.42, width: b.width*0.7, height: b.height*0.42)) }
    faces.append(rs); times.append(CMSampleBufferGetPresentationTimeStamp(sb)) } }
print("frames", faces.count, "with faces", faces.filter { !$0.isEmpty }.count)
// pass 2: blur the union of faces from 10 frames before to 10 after (no flicker, no misses)
let W = Int(size.width*scale) & ~1, H = Int(size.height*scale) & ~1
try? FileManager.default.removeItem(at: dst)
let w = try! AVAssetWriter(outputURL: dst, fileType: .mov)
let vin = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 6_000_000]])
let ad = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: vin, sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H])
w.add(vin); w.startWriting(); w.startSession(atSourceTime: times.first ?? .zero)
let ctx = CIContext()
let (_, o) = reader(); var i = 0
while let sb = o.copyNextSampleBuffer() { guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
  var img = CIImage(cvPixelBuffer: pb).transformed(by: CGAffineTransform(scaleX: scale, y: scale))
  let ext = img.extent
  let blurred = img.clampedToExtent().applyingGaussianBlur(sigma: 14).cropped(to: ext)
  var mask = CIImage(color: .black).cropped(to: ext)
  for j in max(0, i-10)...min(faces.count-1, i+10) { for r in faces[j] {
    let rr = CGRect(x: r.minX*ext.width, y: r.minY*ext.height, width: r.width*ext.width, height: r.height*ext.height).insetBy(dx: -r.width*ext.width*0.35, dy: -r.height*ext.height*0.35)
    mask = CIImage(color: .white).cropped(to: rr).composited(over: mask) } }
  mask = mask.applyingGaussianBlur(sigma: 6).cropped(to: ext)
  img = blurred.applyingFilter("CIBlendWithMask", parameters: [kCIInputBackgroundImageKey: img, kCIInputMaskImageKey: mask])
  while !vin.isReadyForMoreMediaData { usleep(2000) }
  var out: CVPixelBuffer?; CVPixelBufferPoolCreatePixelBuffer(nil, ad.pixelBufferPool!, &out)
  ctx.render(img, to: out!)
  ad.append(out!, withPresentationTime: CMSampleBufferGetPresentationTimeStamp(sb)); i += 1 }
vin.markAsFinished()
let sem = DispatchSemaphore(value: 0); w.finishWriting { sem.signal() }; sem.wait()
print("video", w.status.rawValue, W, H)
// put the original sound back
let mix = AVMutableComposition(); let v2 = AVURLAsset(url: dst)
let tv = mix.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
try! tv.insertTimeRange(CMTimeRange(start: .zero, duration: v2.duration), of: v2.tracks(withMediaType: .video)[0], at: .zero)
let ta = mix.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
try! ta.insertTimeRange(CMTimeRange(start: .zero, duration: v2.duration), of: asset.tracks(withMediaType: .audio)[0], at: .zero)
let final = URL(fileURLWithPath: a[2].replacingOccurrences(of: ".mov", with: ".mp4")); try? FileManager.default.removeItem(at: final)
let ex = AVAssetExportSession(asset: mix, presetName: AVAssetExportPreset640x480)!
ex.outputURL = final; ex.outputFileType = .mp4; ex.shouldOptimizeForNetworkUse = true
ex.exportAsynchronously { sem.signal() }; sem.wait()
print("export", ex.status.rawValue, ex.error?.localizedDescription ?? "ok")
