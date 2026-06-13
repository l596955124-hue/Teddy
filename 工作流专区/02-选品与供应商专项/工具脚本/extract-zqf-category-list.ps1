$sourcePath = "D:\Teddy创业项目\工作流专区\02-选品与供应商专项\供应商资料\1688醉清风礼盒-pageData-20260607.json"
$outputPath = "D:\Teddy创业项目\工作流专区\02-选品与供应商专项\供应商资料\1688醉清风-全店类目总表-20260607.csv"

$json = Get-Content -LiteralPath $sourcePath -Raw | ConvertFrom-Json
$categories = @()

function Add-Category {
    param(
        [Parameter(Mandatory = $true)] $Node,
        [string] $ParentName = "",
        [string] $ParentId = "",
        [int] $Level = 1
    )

    if ($null -eq $Node -or -not ($Node.PSObject.Properties.Name -contains "name")) {
        return
    }

    $name = [string]$Node.name
    $id = [string]$Node.id
    $count = [string]$Node.count

    if ($name -and $id -and $count -match "^\d+$") {
        $script:categories += [pscustomobject]@{
            Level = $Level
            ParentName = $ParentName
            ParentId = $ParentId
            CategoryName = $name
            CategoryId = $id
            Count = [int]$count
            CategoryUrl = "https://yixingfangsc.1688.com/page/offerlist_$id.htm"
            FullPath = if ($ParentName) { "$ParentName > $name" } else { $name }
        }
    }

    if ($Node.PSObject.Properties.Name -contains "children" -and $Node.children) {
        foreach ($child in $Node.children) {
            Add-Category -Node $child -ParentName $name -ParentId $id -Level ($Level + 1)
        }
    }
}

function Walk {
    param($Node)

    if ($null -eq $Node) {
        return
    }

    if ($Node -is [System.Collections.IEnumerable] -and -not ($Node -is [string])) {
        foreach ($item in $Node) {
            Walk -Node $item
        }
        return
    }

    if ($Node -is [pscustomobject]) {
        if (
            ($Node.PSObject.Properties.Name -contains "offerCategoryList") -and
            $Node.offerCategoryList
        ) {
            foreach ($category in $Node.offerCategoryList) {
                Add-Category -Node $category
            }
        }

        foreach ($property in $Node.PSObject.Properties) {
            Walk -Node $property.Value
        }
    }
}

Walk -Node $json

$deduped = $categories |
    Sort-Object CategoryId, Level -Unique |
    Sort-Object Level, ParentId, CategoryName

$deduped | Export-Csv -LiteralPath $outputPath -NoTypeInformation -Encoding UTF8

[pscustomobject]@{
    OutputPath = $outputPath
    CategoryCount = @($deduped).Count
    TotalListedCount = ($deduped | Measure-Object Count -Sum).Sum
}
