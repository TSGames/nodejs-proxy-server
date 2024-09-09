{{- define "helm-nodejs-proxy.name" -}}
{{- .Chart.Name | lower -}}
{{- end }}

{{- define "helm-nodejs-proxy.fullname" -}}
{{- .Release.Name | lower -}}
{{- end }}
