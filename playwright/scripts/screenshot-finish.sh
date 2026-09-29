#!/usr/bin/env bash
#
# TAKEN FROM ABHNER RAMOS BARBOSA'S /screenshot-docs SKILL, unchanged.
#
#   abhnerramos/liferay-learn pull request 191,
#   .claude/scripts/screenshot-finish.sh
#
# Vendored here because a course workspace cannot import from liferay-learn,
# and copied rather than reimplemented so the two cannot drift: the defaults
# below are the published style guide's, and working them out again from the
# guide is how two versions of the same rule end up disagreeing.
#
# If that skill lands, this file should be replaced by whatever shared home it
# gets. It is a copy, not a fork.
#

set -o errexit
set -o nounset
set -o pipefail

#
# Finishes a raw capture for publication: draws the optional highlight box,
# downsizes to the capture profile's final width, and strips metadata. It
# prints the output path and its final dimensions as KEY=VALUE lines.
#
# Usage: bash .claude/scripts/screenshot-finish.sh INPUT.png --output OUTPUT.png
# [--highlight X,Y,W,H] [--scale N] [--max-width N] [--stroke-width N] [--color HEX]
#
# --highlight takes the element's box in CSS pixels relative to the image
# origin, as the capture helper's sidecar JSON records it, and --scale is the
# device scale factor the image was captured at (default 2), so the box lands
# on the right pixels. --max-width defaults to 1600, twice the style guide's
# 800-pixel display width, and only ever shrinks an image.
#
# The image is resized first and the box drawn second, so --stroke-width
# (default 8) is the line's thickness in the published image whatever the
# capture scale or resize ratio. The box is padded by one stroke width so the
# line sits clear of the element's edge, and drawn in #FFC10C, the markup color
# the style guide's course visuals section standardizes.
#
# The highlight is drawn here rather than in the browser so the raw capture
# stays clean: a later run can redraw or move the box without recapturing.
#

function main {
	local color="#FFC10C"
	local highlight=""
	local input=""
	local max_width=1600
	local output=""
	local scale=2
	local stroke_width=8

	while (( ${#} > 0 ))
	do
		case ${1} in
			--color)
				color=${2}
				shift 2
				;;
			--highlight)
				highlight=${2}
				shift 2
				;;
			--max-width)
				max_width=${2}
				shift 2
				;;
			--output)
				output=${2}
				shift 2
				;;
			--scale)
				scale=${2}
				shift 2
				;;
			--stroke-width)
				stroke_width=${2}
				shift 2
				;;
			-*)
				_die "Unknown option ${1}."
				;;
			*)
				[[ -z ${input} ]] || _die "Only one input file is accepted."

				input=${1}
				shift
				;;
		esac
	done

	[[ ! -z ${input} ]] && [[ ! -z ${output} ]] \
		|| _die "Usage: screenshot-finish.sh INPUT.png --output OUTPUT.png [--highlight X,Y,W,H] [--scale N] [--max-width N] [--stroke-width N] [--color HEX]"

	[[ -f ${input} ]] || _die "The input ${input} does not exist."

	local format
	local height
	local width

	read -r format width height < <(identify -format '%m %w %h\n' "${input}[0]")

	[[ ${format} == PNG ]] || _die "The input ${input} is ${format}, not PNG."

	#
	# The resize ratio is computed up front because the box is drawn on the
	# resized image: its coordinates scale by the capture's device scale factor
	# and then by this ratio, and its stroke is in published pixels.
	#

	local ratio

	ratio=$(awk -v iw="${width}" -v mw="${max_width}" 'BEGIN { printf "%.6f", (iw > mw) ? mw / iw : 1 }')

	local -a draw=()

	if [[ ! -z ${highlight} ]]
	then
		local h
		local w
		local x
		local y

		IFS=, read -r x y w h <<< "${highlight}"

		[[ ! -z ${h} ]] || _die "--highlight needs X,Y,W,H in CSS pixels."

		#
		# Pad by one stroke width so the line clears the element's edge, and
		# clamp to the resized image so a box on an element flush with the edge
		# does not disappear off it.
		#

		local x1 y1 x2 y2

		read -r x1 y1 x2 y2 < <(awk \
			-v h="${h}" -v ih="${height}" -v iw="${width}" -v r="${ratio}" -v s="${scale}" -v sw="${stroke_width}" -v w="${w}" -v x="${x}" -v y="${y}" \
			'BEGIN {
				ow = int(iw * r + 0.5); oh = int(ih * r + 0.5)
				pad = sw
				x1 = x * s * r - pad; y1 = y * s * r - pad
				x2 = (x + w) * s * r + pad; y2 = (y + h) * s * r + pad
				half = sw / 2
				if (x1 < half) x1 = half
				if (y1 < half) y1 = half
				if (x2 > ow - 1 - half) x2 = ow - 1 - half
				if (y2 > oh - 1 - half) y2 = oh - 1 - half
				# Half-pixel coordinates put the stroke on pixel boundaries, so an
				# even width covers exactly that many pixels instead of one more.
				printf "%.1f %.1f %.1f %.1f\n", int(x1) + 0.5, int(y1) + 0.5, int(x2) + 0.5, int(y2) + 0.5
			}')

		draw=(-fill none -stroke "${color}" -strokewidth "${stroke_width}" -draw "rectangle ${x1},${y1} ${x2},${y2}")
	fi

	mkdir --parents "$(dirname "${output}")"

	magick "${input}" -resize "${max_width}x>" "${draw[@]}" -strip "${output}"

	read -r width height < <(identify -format '%w %h\n' "${output}[0]")

	echo "OUTPUT=${output}"
	echo "WIDTH=${width}"
	echo "HEIGHT=${height}"
}

function _die {
	echo "${*}" >&2

	exit 1
}

main "${@}"